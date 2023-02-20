import { router } from "../trpc";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { accountRouter } from "./account";

export const appRouter = router({
  account: accountRouter,
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
