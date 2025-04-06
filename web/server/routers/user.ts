import { router, procedure } from "../trpc";
import { z } from "zod";
import {
  createUser,
  findUserByUid,
  updateUserByUid,
  searchUsers,
  findUnverifiedUsers,
  deleteUser,
  updateUserByEmail,
} from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import { Role } from "../../utils/types/account";
import {
  FosterType,
  Size,
  Breed,
  Gender,
  Age,
  GoodWith,
  Medical,
  Behavioral,
} from "../../utils/types/post";
import { IUser } from "../../utils/types/user";
import { addAccount } from "../../db/actions/Account";
import Account from "../../db/models/Account";
import { deleteFirebaseUser } from "../../utils/firebase/firebaseAdmin";
import { sendJunoEmail } from "../juno";

const userPreferencesSchema = z.object({
  preferredEmail: z.string().email().optional(),
  name: z.string().optional(),
  type: z.array(z.nativeEnum(FosterType)),
  size: z.array(z.nativeEnum(Size)),
  preferredBreeds: z.array(z.nativeEnum(Breed)),
  restrictedBreeds: z.array(z.nativeEnum(Breed)),
  gender: z.array(z.nativeEnum(Gender)),
  age: z.array(z.nativeEnum(Age)),
  dogsNotGoodWith: z.array(z.nativeEnum(GoodWith)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
});

export const userRouter = router({
  add: procedure
    .input(
      z.object({
        email: z.string().email(),
        uid: z.string(),
        name: z.string().optional(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await findUserByUid(input.uid);
        if (!user) {
          await createUser({
            ...input,
            verifiedByAdmin: false,
            disabled: false,
            hasCompletedOnboarding: false,
          });
        }
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
      }
    }),
  get: procedure
    .input(
      z.object({
        uid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await findUserByUid(input.uid);
        return user;
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
          });
      }
    }),
  delete: procedure.input(z.string()).mutation(async ({ ctx, input }) => {
    try {
      const user = await findUserByUid(input);
      const userEmail = user?.email;

      const deletedUser = await deleteUser(input);
      await deleteFirebaseUser(input);

      if (userEmail) {
        const denialEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your account request has been denied</h2>
            <p>We regret to inform you that your account request for Angels Among Us has been denied.</p>
            <p>If you believe this was a mistake or would like to discuss this further, please contact us.</p>
            <p>Best regards,<br>Angels Among Us Team</p>
          </div>
        `;
        await sendJunoEmail(
          denialEmailContent,
          "Your account request has been denied",
          [{ email: userEmail, name: userEmail.split("@")[0] }],
          false
        );
      }

      return { success: true };
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      else
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
    }
  }),
  disableStatus: procedure
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
          cause: e,
        });
      }
    }),
  modifyRoleEnableStatus: procedure
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
          cause: e,
        });
      }
    }),
  updateUserPreferences: procedure
    .input(
      z.object({
        uid: z.string(),
        updateFields: userPreferencesSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateUserByUid(input.uid, {
          ...input.updateFields,
          hasCompletedOnboarding: true,
        });
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
      }
    }),
  searchUsers: procedure
    .input(
      z.object({
        searchParams: z
          .object({
            role: z.nativeEnum(Role),
            type: z.array(z.nativeEnum(FosterType)),
            size: z.array(z.nativeEnum(Size)),
            preferredBreeds: z.array(z.nativeEnum(Breed)),
            gender: z.array(z.nativeEnum(Gender)),
            age: z.array(z.nativeEnum(Age)),
            dogsNotGoodWith: z.array(z.nativeEnum(GoodWith)),
            medical: z.array(z.nativeEnum(Medical)),
            behavioral: z.array(z.nativeEnum(Behavioral)),
          })
          .partial(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { searchParams } = input;
        const res = await searchUsers(searchParams);
        return { data: res };
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
          });
      }
    }),
  getUnverifiedUsers: procedure.query(async () => {
    try {
      const res = await findUnverifiedUsers();
      return res as IUser[];
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      else
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
    }
  }),
});
