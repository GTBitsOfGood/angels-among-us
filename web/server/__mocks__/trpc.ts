import { initTRPC } from "@trpc/server";
import { Context } from "../context";

const t = initTRPC.context<Context>().create();
const unauthenticatedMiddleware = t.middleware(({ next, ctx }) =>
  next({
    ctx: {
      session: ctx.session,
    },
  })
);

const unauthenticatedProcedure = t.procedure.use(unauthenticatedMiddleware);

export const middleware = t.middleware;

export const router = t.router;
export const procedure = unauthenticatedProcedure;
