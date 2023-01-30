import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { addAccount, findAccount } from "../../db/actions/Account";
import { updateUserAccess } from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";

export const accountRouter = router({
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
