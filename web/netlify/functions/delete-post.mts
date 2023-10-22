import type { Config } from "@netlify/functions"
import Post from "../../db/models/Post"
import storageClient from "../../db/storageConnect"
import { consts } from "../../utils/consts"

export default async (req: Request) => {
    let retryCount = 0;
    let success = false;
  
    while (!success && retryCount < 3) {
      try {
        const res = await storageClient.listObjectsV2({ Bucket: consts.storageBucket });
        const posts = await Post.find({ pending: false });
  
        //find the attachments not found in posts
        const attachments = res?.Contents?.filter((x) => !posts.some((y) => y.attachments.includes(x.Key)));
  
        //delete those attachments from bucket
        await attachments?.map((x) => storageClient.deleteObject({ Bucket: "development-uploads", Key: x.Key }));
  
        success = true;
        return "OK";
      } catch (err) {
        retryCount++;
      }
    }
  
    throw new Error('Failed to delete post after 3 retries');
}

export const config: Config = {
    schedule: "@daily"
}
