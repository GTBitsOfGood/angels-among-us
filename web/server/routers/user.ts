import { router, publicProcedure } from "../trpc";
import { z } from "zod";
export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(({ input }) => {}),
  list: publicProcedure.query(() => {
    // ...
    return [];
  }),
});
