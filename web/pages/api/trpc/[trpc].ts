import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";
import { createContext } from "../../../server/context";

// export API handler
export default createNextApiHandler({
  router: appRouter, // your outermost router, see https://trpc.io/docs/procedures
  createContext, // your request context, see https://trpc.io/docs/context
});
