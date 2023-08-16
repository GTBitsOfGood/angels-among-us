import { router } from "../trpc";
import { userRouter } from "./user";
import { postRouter } from "./post";
import { accountRouter } from "./account";
import { authRouter } from "./auth";

export const appRouter = router({
  account: accountRouter,
  user: userRouter,
  post: postRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
