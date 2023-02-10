import { ClientSession } from "mongoose";
import Post, { IPost } from "../models/Post";

async function createPost(post: IPost, session?: ClientSession) {
  return await Post.create([post], { session: session });
}

export { createPost };
