import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { removeAccount, updateAccount } from "../../db/actions/Account";
import { updateUser } from "../../db/actions/User";
import Account from "../../db/models/Account";
import { router, protectedProcedure } from "../trpc";

const emailInput = {
  email: z.string().email("Invalid email provided"),
};

export const accountRouter = router({
  modify: protectedProcedure
    .input(
      z.object({
        admin: z.boolean(),
        ...emailInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email;
      if (ctx.session?.email === email)
        throw new TRPCError({
          message: "Unauthorized - Cannot modify own account",
          code: "UNAUTHORIZED",
        });

      const session = await Account.startSession();
      session.startTransaction();

      try {
        const updateResult = await updateAccount(
          email,
          { admin: input.admin },
          session
        );

        if (!updateResult)
          throw new TRPCError({
            message: "Account with specified email not found",
            code: "NOT_FOUND",
          });

        await updateUser(email, { admin: input.admin }, session);

        session.commitTransaction();
        return { success: true };
      } catch (e) {
        session.abortTransaction();

        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
          });
      }
    }),
  remove: protectedProcedure
    .input(z.object(emailInput))
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
});
