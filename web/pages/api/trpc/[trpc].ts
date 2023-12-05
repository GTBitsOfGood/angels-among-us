import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";
import { createContext } from "../../../server/context";
import * as Sentry from "@sentry/nextjs";

// export API handler
export default createNextApiHandler({
  router: appRouter, // your outermost router, see https://trpc.io/docs/procedures
  createContext, // your request context, see https://trpc.io/docs/context
  onError(opts) {
    const { error } = opts;
    Sentry.captureException(error, {
      tags: {
        code: error.code,
      },
    });
  },
});
