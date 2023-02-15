import { ClientSession, ObjectId, UpdateQuery } from "mongoose";
import Post from "../models/Post";
import { IPost } from "../../utils/types/post";

async function createPost(post: IPost, session?: ClientSession) {
  return await Post.create([post], { session: session });
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
export { createPost, updatePostDetails, updatePostStatus };
