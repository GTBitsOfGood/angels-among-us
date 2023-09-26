import { ClientSession, FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import Post from "../models/Post";
import { IPendingPost, IPost } from "../../utils/types/post";
import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { consts } from "../../utils/consts";
import { sign } from "jsonwebtoken";
import storageClient from "../storageConnect";

type UploadInfo = Record<string, string>;

async function getPost(
  oid: ObjectId,
  publicAttachmentUrls: boolean
): Promise<IPost & { _id: string; __v: number }> {
  const post = await Post.findOne({ _id: oid });
  if (publicAttachmentUrls) {
    post.attachments = post.attachments.map((attachment: string) => {
      return `${consts.storageBucketURL}/${attachment}`;
    });
  }
  return post;
}

async function createPost(post: IPendingPost, session?: ClientSession) {
  const pending = post.attachments.length != 0;
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
  postId: ObjectId,
  post: IPendingPost
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

async function deleteAttachments(keysToDelete: string[]) {
  for (let i = 0; i < 2; i++) {
    const objectsToDelete = keysToDelete.map((keyToDelete) => ({
      Key: keyToDelete,
    }));
    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: consts.storageBucket,
      Delete: { Objects: objectsToDelete, Quiet: true },
    });
    try {
      const returned = await storageClient.send(deleteObjectsCommand);
      let arr: string[] = [];
      if (returned["Deleted"]) {
        returned["Deleted"].forEach((element) => {
          element["Key"] &&
            !element["DeleteMarker"] &&
            arr.push(element["Key"]);
        });
        keysToDelete = arr;
      } else {
        return { success: true };
      }
    } catch (error) {
      return { success: false };
    }
  }
  //false or true? depends on how we want to handle partial deletes
  return { success: true };
}

async function deletePost(id: ObjectId) {
  try {
    const post = await getPost(id, false);
    const returned = await deleteAttachments(post.attachments);
    if (returned.success) {
      const deletePost = await Post.deleteOne({ _id: id });
      if (deletePost.deletedCount === 1) {
        return { success: true };
      }
    }
  } catch (e) {}
  return { success: false };
}

async function finalizePost(id: ObjectId, session?: ClientSession) {
  const post = await Post.findOne({ _id: id });
  const uploadedObjects = await storageClient.listObjectsV2({
    Bucket: consts.storageBucket,
    Prefix: `${id}`,
  });
  const attachmentKeys = post.attachments.sort();
  if (post.attachments.length == 0) return post;
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
}

async function updatePostDetails(
  oid: ObjectId,
  update: UpdateQuery<IPost>,
  session?: ClientSession
) {
  return await Post.findOneAndUpdate({ _id: oid }, update, {
    session: session,
  });
}

async function updatePostStatus(oid: ObjectId, session?: ClientSession) {
  return await Post.findOneAndUpdate(
    { _id: oid },
    [{ $set: { covered: { $not: "$covered" } } }],
    { session: session }
  );
}

async function getAllPosts() {
  return await Post.find().sort({ date: -1 });
}

async function getFilteredPosts(filter: FilterQuery<IPost>) {
  const posts = await Post.find(filter).sort({ date: -1 });
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
  updatePostDetails,
  updatePostStatus,
  finalizePost,
  getAllPosts,
  getFilteredPosts,
};
