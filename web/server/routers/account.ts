import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  removeAccount,
  updateAccount,
  addAccount,
  findAccount,
  findAll,
} from "../../db/actions/Account";
import { updateUserByEmail } from "../../db/actions/User";
import Account from "../../db/models/Account";
import { Role } from "../../utils/types/account";
import { router, protectedProcedure } from "../trpc";

const emailInput = {
  email: z.string().email("Invalid email provided"),
};

export const accountRouter = router({
  modify: protectedProcedure
    .input(
      z.object({
        role: z.nativeEnum(Role),
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
          { role: input.role },
          session
        );

        if (!updateResult)
          throw new TRPCError({
            message: "Account with specified email not found",
            code: "NOT_FOUND",
          });

        await updateUserByEmail(email, { role: input.role }, session);

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
        await updateUserByEmail(email, { disabled: true }, session);

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
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.email === input.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User cannot add themselves",
        });
      }

      const session = await Account.startSession();
      session.startTransaction();

      try {
        const inputData: { email: string; role: Role } = {
          email: input.email,
          role: input.role,
        };

        if ((await addAccount(inputData, session)) === null) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account already exists",
          });
        }

        await updateUserByEmail(
          input.email,
          { role: input.role, disabled: false },
          session
        );

        session.commitTransaction();
        return { success: true };
      } catch (e) {
        session.abortTransaction();

        if (e instanceof TRPCError) {
          throw e;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          });
        }
      }
    }),
  get: protectedProcedure
    .input(
      z.object({
        email: z.string().email().nullable(),
      })
    )
    .output(
      z.object({
        role: z.nativeEnum(Role).nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (input.email === null) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        } else {
          const account = await findAccount(input.email);
          return {
            role: !account ? null : account.role,
          };
        }
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          });
      }
    }),

  getAll: protectedProcedure
    // .output(
    //   z.array(
    //     z.object({
    //       email: z.string().email(),
    //       role: z.nativeEnum(Role),
    //     })
    //   )
    // )
    .query(async ({ ctx }) => {
      const session = await Account.startSession();
      session.startTransaction();
      try {
        console.log("LOG B4 FIND ALL CALLED");
        const accounts = await findAll(session);
        console.log(accounts);
        return accounts;
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occured",
          });
      }
    }),
});
