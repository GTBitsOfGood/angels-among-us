import { ClientSession, ObjectId, UpdateQuery } from "mongoose";
import Post from "../models/Post";
import { IPendingPost, IPost } from "../../utils/types/post";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import b2Client from "../b2connect";

type UploadInfo = Record<string, string>;

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
        size > 500
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
    Bucket: process.env.B2_BUCKET,
  });
  return getSignedUrl(b2Client, command);
}

async function getResizedUploadUrl(uuid: string): Promise<string> {
  return "";
}

async function finalizePost(id: ObjectId) {
  const post = await Post.findOne({ _id: id });
  const uploadedObjects = await b2Client.listObjectsV2({
    Bucket: process.env.B2_BUCKET,
    Prefix: `${id}`,
  });

  const allKeys = post.attachments.images.concat(post.attachments.videos);
  allKeys.sort();

  if (
    !uploadedObjects.Contents ||
    uploadedObjects.Contents.length < allKeys.length
  ) {
    throw new Error("All posts not successfully uploaded");
  }
  uploadedObjects.Contents.sort();
  for (let i = 0; i < allKeys; i++) {
    if (allKeys[i] !== uploadedObjects.Contents[i]) {
      throw new Error("All posts not successfully uploaded");
    }
  }
  await post.findOneAndUpdate({ _id: id }, { pending: false });
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
export { createPost, updatePostDetails, updatePostStatus, finalizePost };
