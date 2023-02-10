import { ClientSession, ObjectId, UpdateQuery } from "mongoose";
import Post, { IPost } from "../models/Post";

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

export { createPost, updatePostDetails };
