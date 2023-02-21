import { router, publicProcedure } from "../trpc";
import { boolean, z } from "zod";
import { createUser, findUserByUid } from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import User from "../../db/models/User";
import { Role } from "../../utils/types/account";
import { findAccount } from "../../db/actions/Account";

const userSchema = z.object({
  uid: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.nativeEnum(Role),
  disabled: z.boolean(false),
});

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        email: z.string(),
        name: z.string(),
      })
    )
    .output(
      z.object({
        found: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const account = await findAccount(input.email);
        if (account === null) {
          return { found: false };
        }
        const user = await findUserByUid(input.uid);
        if (!user) {
          await createUser({
            ...input,
            role: account.role,
            disabled: false,
          });
        }
        return { found: true };
      } catch (error) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
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
