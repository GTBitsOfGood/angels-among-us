import { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose";
import Post from "../models/Post";
import {
  IPendingFinalizePost,
  IPendingPost,
  IPendingUpdatePost,
  IPost,
} from "../../utils/types/post";
import {
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { consts } from "../../utils/consts";
import { sign } from "jsonwebtoken";
import storageClient from "../storageConnect";
import { captureException } from "@sentry/nextjs";

export type UploadInfo = Record<string, string>;

async function getPost(oid: Types.ObjectId, publicAttachmentUrls: boolean) {
  const post: (IPost & { _id: Types.ObjectId; __v: number }) | null =
    await Post.findById(oid).exec();
  if (publicAttachmentUrls && post) {
    post.attachments = post.attachments.map((attachment: string) => {
      return `${consts.storageBucketURL}/${attachment}`;
    });
  }
  return post;
}

async function createPost(
  post: IPendingPost,
  session?: ClientSession
): Promise<IPendingFinalizePost> {
  const pending = post.attachments.length !== 0;
  const createdPost = await Post.create(
    [
      {
        ...post,
        pending: pending,
        attachments: [],
      },
    ],
    { session: session }
  );
  const postId = createdPost[0]._id;
  const uploadInfo = await getAttachmentUploadURLs(postId, post);
  let updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    {
      attachments: Object.keys(uploadInfo),
    },
    { session: session, returnDocument: "after" }
  );
  return {
    ...updatedPost.toObject(),
    attachments: uploadInfo,
  };
}

async function getAttachmentUploadURLs(
  postId: Types.ObjectId,
  post: IPendingPost | IPendingUpdatePost
): Promise<UploadInfo> {
  const attachmentURLs: Record<string, string> = {};
  for (let i = 0; i < post.attachments.length; i++) {
    const attachment = post.attachments[i];
    const attachmentUUID = `${postId}/${attachment.key}`;
    let uploadUrl;
    if (attachment.type === "image") {
      const size = attachment.length * attachment.width;
      uploadUrl =
        size > 2000 * 2000
          ? getResizedUploadUrl(attachmentUUID)
          : getDirectUploadUrl(attachmentUUID);
    } else {
      uploadUrl = getDirectUploadUrl(attachmentUUID);
    }
    attachmentURLs[attachmentUUID] = await uploadUrl;
  }
  return attachmentURLs;
}

async function getDirectUploadUrl(uuid: string): Promise<string> {
  const command = new PutObjectCommand({
    Key: uuid,
    Bucket: consts.storageBucket,
  });
  return getSignedUrl(storageClient, command);
}

async function getResizedUploadUrl(uuid: string): Promise<string> {
  const token = sign({ uuid: uuid }, process.env.JWT_SIGNING_KEY ?? "");
  return `${consts.baseUrl}/api/resizedUpload/${token}`;
}

/**
 * Deletes all attachments from a post given its _id. Deletes objects from storage bucket using
 * prefix of post id, **not** the post's attachments array.
 * @param oid post _id
 * @returns void if successful
 * @throws Deletion error
 */
async function deleteAllAttachments(oid: Types.ObjectId) {
  let numTries = 0;
  const maxTries = 3;

  const uploadedObjects = await storageClient.listObjectsV2({
    Bucket: consts.storageBucket,
    Prefix: `${oid.toString()}`,
  });
  if (!uploadedObjects.Contents) {
    return;
  }
  const objectsToDelete = uploadedObjects.Contents.map((content) => ({
    Key: content.Key,
  }));
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: consts.storageBucket,
    Delete: { Objects: objectsToDelete },
  });
  try {
    const returned = await storageClient.send(deleteObjectsCommand);
    if (returned.Deleted?.length === objectsToDelete.length) {
      return;
    } else {
      throw new Error("Attachments were not successfully deleted.");
    }
  } catch (e) {
    if (++numTries == maxTries) {
      throw e;
    }
  }
}

async function deleteAttachments(keysToDelete: string[]) {
  let numTries = 0;
  const maxTries = 3;
  const objectsToDelete = keysToDelete.map((keyToDelete) => ({
    Key: keyToDelete,
  }));
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: consts.storageBucket,
    Delete: { Objects: objectsToDelete },
  });
  while (true) {
    try {
      const returned = await storageClient.send(deleteObjectsCommand);
      if (returned.Deleted?.length === keysToDelete.length) {
        return { success: true };
      } else {
        throw new Error("All attachments not successfully deleted.");
      }
    } catch (e) {
      //TODO: Write cron job to mark unsuccessful deletions to delete later
      if (++numTries == maxTries) {
        throw e;
      }
    }
  }
}

async function deletePost(id: Types.ObjectId) {
  const post = await getPost(id, false);
  if (!post) {
    throw new Error("Post to be deleted could not be found");
  }
  try {
    await deleteAttachments(post.attachments);
  } catch (e) {
    captureException(e);
  }

  const deletePost = await Post.findByIdAndDelete(id);
  if (!deletePost) {
    throw new Error("Post document deletion failed");
  }
  return { success: true };
}

async function finalizePost(id: Types.ObjectId, session?: ClientSession) {
  const post = await Post.findOne({ _id: id });
  const uploadedObjects = await storageClient.listObjectsV2({
    Bucket: consts.storageBucket,
    Prefix: `${id}`,
  });
  const attachmentKeys = post.attachments.sort();
  if (post.attachments.length == 0) return post;

  try {
    if (
      !uploadedObjects.Contents ||
      uploadedObjects.KeyCount !== attachmentKeys.length
    ) {
      throw new Error("All posts not successfully uploaded");
    }
    const uploadKeys = uploadedObjects.Contents.map((x) => x.Key).sort();
    for (let i = 0; i < attachmentKeys.length; i++) {
      if (attachmentKeys[i] !== uploadKeys[i]) {
        throw new Error("All posts not successfully uploaded");
      }
    }
    return await Post.findOneAndUpdate(
      { _id: id },
      { pending: false },
      { session: session, returnDocument: "after" }
    );
  } catch (e) {
    // Error with uploading all attachments, delete new post document and corresponding attachments
    await deletePost(id);
    await deleteAllAttachments(id);
    throw e;
  }
}

/**
 * Finalizes attachments on new post with updated fields.
 *
 * @param oldId existing post document id with old fields (pre-edit)
 * @param newId newly created post document id with updated fields (post-edit)
 * @param session transaction session
 * @returns new finalized post document
 * @throws on failure to upload or delete attachments (old or new)
 */
async function finalizePostEdit(
  oldId: Types.ObjectId,
  newId: Types.ObjectId,
  session?: ClientSession
) {
  const finalizedPost = await finalizePost(newId, session);

  try {
    await deletePost(oldId);
    await deleteAllAttachments(oldId);
  } catch (e) {
    // Error deleting old attachments or document
    throw new Error(
      "Failed to delete existing attachments and/or post document."
    );
  } finally {
    return finalizedPost;
  }
}

async function updatePostStatus(oid: Types.ObjectId, session?: ClientSession) {
  return await Post.findOneAndUpdate(
    { _id: oid },
    [
      {
        $set: {
          covered: { $not: "$covered" },
          date: {
            $cond: {
              if: { $eq: ["$covered", true] }, // modify date only when switching covered: true -> false
              then: new Date(),
              else: "$date",
            },
          },
        },
      },
    ],
    { session: session }
  );
}

async function getAllPosts() {
  return await Post.find().sort({ date: -1 });
}

async function getAttachments(oid: Types.ObjectId) {
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: consts.storageBucket,
    Prefix: oid.toString(),
  });
  const attachInfo = await storageClient.send(listObjectsCommand);
  return attachInfo;
}

async function getFilteredPosts(filter: FilterQuery<IPost>) {
  const posts = await Post.find(filter, { __v: 0 }).sort({ date: -1 }).exec();
  posts.forEach(
    (post) =>
      (post.attachments = post.attachments.map(
        (attachment: string) => `${consts.storageBucketURL}/${attachment}`
      ))
  );
  return posts;
}

export {
  getPost,
  createPost,
  deletePost,
  updatePostStatus,
  finalizePost,
  finalizePostEdit,
  getAllPosts,
  getAttachments,
  getFilteredPosts,
  deleteAttachments,
};
