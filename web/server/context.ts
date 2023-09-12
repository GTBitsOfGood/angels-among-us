import { inferAsyncReturnType, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import dbConnect from "../db/dbConnect";
import nookies from "nookies";
import { firebaseAdmin } from "../utils/firebase/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { errorCodeMessageMap } from "../utils/errorCode";
import * as Sentry from "@sentry/nextjs";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: DecodedIdToken | null;
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  await dbConnect();

  Sentry.setUser(opts?.session ?? null);

  return {
    session: opts?.session,
  };
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  try {
    const cookies = nookies.get(opts);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const contextInner = await createContextInner({ session: token });

    return {
      ...contextInner,
      req: opts.req,
      res: opts.res,
    };
  } catch (e) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        errorCodeMessageMap[
          (e as any).code as keyof typeof errorCodeMessageMap
        ],
    });
  }
}
export type Context = inferAsyncReturnType<typeof createContextInner>;
