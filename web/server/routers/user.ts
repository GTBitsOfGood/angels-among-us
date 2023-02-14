import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { findUserByUid } from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
export const userRouter = router({
  get: publicProcedure
    .input(
      z.object({
        uid: z.nullable(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const uid = input.uid;

      if (uid === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      } else {
        const user = await findUserByUid(uid);
        if (user === null) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account does not exist",
          });
        }
        return user;
      }
    }),
});
