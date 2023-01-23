import { readPosts } from "../../db/actions/Post";
import { router, publicProcedure } from "../trpc";
export const postRouter = router({
  list: publicProcedure.query(async () => {
    return await readPosts();
  }),
});
