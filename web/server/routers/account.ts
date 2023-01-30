import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { removeAccount } from "../../db/actions/Account";
import { updateUser } from "../../db/actions/User";
import Account from "../../db/models/Account";
import { router, protectedProcedure } from "../trpc";
import { addAccount, findAccount } from "../../db/actions/Account";
import { updateUserAccess } from "../../db/actions/User";
import mongoose from "mongoose";

export const accountRouter = router({
  remove: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email provided"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email;
      if (ctx.session?.email === email)
        throw new TRPCError({
          message: "Unauthorized - Cannot remove own account",
          code: "UNAUTHORIZED",
        });

      const session = await Account.startSession();
      session.startTransaction();

      try {
        await removeAccount(email, session);
        await updateUser(email, { disabled: true }, session);

        session.commitTransaction();

        return { success: true };
      } catch (e) {
        session.abortTransaction();

        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  add: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        admin: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.email === input.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User cannot add themselves",
        });
      }

      console.log("hi");

      if ((await findAccount(input.email)).length == 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Account already exists",
        });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await addAccount(input.email, input.admin);
        await updateUserAccess(input.email, input.admin);
        return { success: true };
      } catch (e) {
        session.abortTransaction();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
