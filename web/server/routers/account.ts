import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  updateAccount,
  addAccount,
  findAccount,
  findAll,
  removeAllAccounts,
  searchAccounts,
} from "../../db/actions/Account";
import {
  updateAllUsers,
  updateUserBySerializedEmail,
} from "../../db/actions/User";
import Account from "../../db/models/Account";
import { IAccount, Role } from "../../utils/types/account";
import { router, procedure } from "../trpc";

const emailInput = {
  email: z.string().email("Invalid email provided"),
};

const searchInput = z.object({
  searchSubject: z.string(),
});

export const accountRouter = router({
  modify: procedure
    .input(
      z.object({
        role: z.nativeEnum(Role),
        ...emailInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email;
      if (!ctx.session?.email)
        throw new TRPCError({
          message: "Unauthorized - Caller has no email",
          code: "UNAUTHORIZED",
        });
      if (ctx.session?.email.toLowerCase() === email.toLowerCase())
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

        await updateUserBySerializedEmail(
          email.toLowerCase(),
          { role: input.role },
          session
        );

        session.commitTransaction();
        return { success: true };
      } catch (e) {
        console.error(e);
        throw e;
        session.abortTransaction();

        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
          });
      }
    }),
  remove: procedure
    .input(z.array(z.string().email()))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.email)
        throw new TRPCError({
          message: "Unauthorized - Caller has no email",
          code: "UNAUTHORIZED",
        });
      if (input.includes(ctx.session.email))
        throw new TRPCError({
          message: "Unauthorized - Cannot remove own account",
          code: "UNAUTHORIZED",
        });

      const session = await Account.startSession();
      session.startTransaction();

      try {
        await removeAllAccounts(input, session);
        await updateAllUsers(
          input.map((email) => email.toLowerCase()),
          { disabled: true },
          session
        );
        session.commitTransaction();

        return { success: true };
      } catch (e) {
        session.abortTransaction();

        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
      }
    }),

  add: procedure
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
        const inputData: IAccount = {
          email: input.email,
          serializedEmail: input.email.toLowerCase(),
          role: input.role,
        };

        if ((await addAccount(inputData, session)) === null) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account already exists",
          });
        }

        await updateUserBySerializedEmail(
          input.email.toLowerCase(),
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
            cause: e,
          });
        }
      }
    }),

  getRole: procedure
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
            cause: e,
          });
      }
    }),

  getAll: procedure.query(async ({ ctx }) => {
    const session = await Account.startSession();
    session.startTransaction();
    try {
      const accounts = await findAll(session);
      return accounts as IAccount[];
    } catch (e) {
      session.abortTransaction();
      if (e instanceof TRPCError) throw e;
      else
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occured",
          cause: e,
        });
    }
  }),

  search: procedure.input(searchInput).query(async ({ input, ctx }) => {
    const session = await Account.startSession();
    session.startTransaction();
    try {
      const { searchSubject } = input;
      const accounts = searchSubject
        ? await searchAccounts(searchSubject, session)
        : await findAll();
      session.commitTransaction();
      return accounts as IAccount[];
    } catch (e) {
      session.abortTransaction();
      if (e instanceof TRPCError) throw e;
      else
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occured",
          cause: e,
        });
    }
  }),
});
