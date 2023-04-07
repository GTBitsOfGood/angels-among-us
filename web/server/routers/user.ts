import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import {
  createUser,
  filterUsers,
  findUserByUid,
  updateUserByUid,
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
  Trained,
  Status,
} from "../../utils/types/post";

const userSchema = z.object({
  type: z.array(z.nativeEnum(FosterType)),
  size: z.array(z.nativeEnum(Size)),
  breed: z.array(z.nativeEnum(Breed)),
  gender: z.array(z.nativeEnum(Gender)),
  age: z.array(z.nativeEnum(Age)),
  temperament: z.array(z.nativeEnum(Temperament)),
  goodWith: z.array(z.nativeEnum(GoodWith)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.array(z.nativeEnum(Trained)),
  spayNeuterStatus: z.array(z.nativeEnum(Status)),
});

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
  updateUserPreferences: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        updateFields: userSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateUserByUid(input.uid, input.updateFields);
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  filter: protectedProcedure
    .input(
      z.object({
        roles: z
          .array(z.nativeEnum(Role))
          .optional()
          .default(Object.values(Role)),
        query: z.string().optional().default(""),
      })
    )
    .mutation(async ({ input }) => {
      return filterUsers(input.roles, input.query);
    }),
});
