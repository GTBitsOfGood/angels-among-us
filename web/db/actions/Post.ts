import Post, { IPost } from "../models/Post";

async function readPosts(): Promise<IPost[]> {
  return await Post.find({});
}

export { readPosts };
