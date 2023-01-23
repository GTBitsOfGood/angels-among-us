import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import dbConnect from "../db/dbConnect";
import nookies from "nookies";
import { firebaseAdmin } from "../utils/firebase/firebaseAdmin";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  await dbConnect();
  try {
    const cookies = nookies.get(opts);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    return {
      session: token,
    };
  } catch (err) {
    return { session: null };
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;
