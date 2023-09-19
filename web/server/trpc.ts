import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import * as Sentry from "@sentry/nextjs";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const middleware = t.middleware;

const sentryMiddleware = t.middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  })
);

const authedSentryMiddleware = sentryMiddleware.unstable_pipe(isAuthed);

export const router = t.router;
export const procedure = t.procedure.use(authedSentryMiddleware);
