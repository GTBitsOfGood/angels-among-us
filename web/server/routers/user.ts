import { router, publicProcedure } from "../trpc";
import { boolean, z } from "zod";
import { createUser, findUserByUid } from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import User from "../../db/models/User";
import { Role } from "../../utils/types/account";
import { findAccount } from "../../db/actions/Account";

export const userRouter = router({
  add: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        uid: z.string(),
        name: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await findUserByUid(input.uid);
      if (!user) {
        await createUser({
          ...input,
          disabled: false,
        });
      }
    }),
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
