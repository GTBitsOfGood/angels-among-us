import { router, procedure } from "../trpc";
import { z } from "zod";
import {
  createUser,
  findUserByUid,
  updateUserByUid,
  searchUsers,
} from "../../db/actions/User";
import { TRPCError } from "@trpc/server";
import { Role } from "../../utils/types/account";
import {
  FosterType,
  Size,
  Breed,
  Gender,
  Age,
  Temperament,
  GoodWith,
  Medical,
  Behavioral,
  Status,
} from "../../utils/types/post";
import { IUser } from "../../utils/types/user";

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

const userSchema: z.ZodType<
  Required<Omit<IUser, "name">> | Partial<Pick<IUser, "name">>
> = z.object({
  uid: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  disabled: z.boolean(),
  hasCompletedOnboarding: z.boolean(),
  name: z.string().optional(),
  type: z.nativeEnum(FosterType),
  size: z.nativeEnum(Size),
  restrictedBreeds: z.array(z.nativeEnum(Breed)),
  preferredBreeds: z.array(z.nativeEnum(Breed)),
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
  addToAppliedTo: procedure
    .input(
      z.object({
        uid: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateUserByUid(input.uid, {
          $push: { appliedTo: input.postId },
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
});
