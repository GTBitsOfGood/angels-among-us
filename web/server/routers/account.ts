import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { removeAccount } from "../../db/actions/Account";
import { updateUser } from "../../db/actions/User";
import Account from "../../db/models/Account";
import { router, protectedProcedure } from "../trpc";

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
});
