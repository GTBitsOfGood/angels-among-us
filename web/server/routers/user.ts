import { router, publicProcedure } from "../trpc";
import { boolean, z } from "zod";
import {
  createUser,
  findUserByUid,
  updateUserByUid,
} from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import { Role } from "../../utils/types/account";

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
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await findUserByUid(input.uid);
        if (!user) {
          await createUser({
            ...input,
            disabled: false,
          });
        }
      } catch (e) {
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
      try {
        if (input.uid === null) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        } else {
          const user = await findUserByUid(input.uid);
          return user;
        }
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
          });
      }
    }),
  disableStatus: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await updateUserByUid(input.uid, { disabled: true });
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  modifyRoleEnableStatus: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await updateUserByUid(input.uid, { role: input.role, disabled: false });
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
