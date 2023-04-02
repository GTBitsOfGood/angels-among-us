import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongoose";
import { z } from "zod";
import {
  createPost,
  finalizePost,
  getPost,
  getAllPosts,
  updatePostDetails,
  updatePostStatus,
} from "../../db/actions/Post";
import Post from "../../db/models/Post";
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
import {
  router,
  creatorProcedure,
  publicProcedure,
  protectedProcedure,
} from "../trpc";

const zodOidType = z.custom<ObjectId>((item) => String(item).length == 24);

const postSchema = z.object({
  type: z.nativeEnum(FosterType),
  size: z.nativeEnum(Size),
  breed: z.array(z.nativeEnum(Breed)),
  gender: z.nativeEnum(Gender),
  age: z.nativeEnum(Age),
  temperament: z.nativeEnum(Temperament),
  goodWith: z.array(z.nativeEnum(GoodWith)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained),
  crateTrained: z.nativeEnum(Trained),
  spayNeuterStatus: z.nativeEnum(Status),
  attachments: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("image"),
        key: z.string(),
        length: z.number(),
        width: z.number(),
      }),
      z.object({
        type: z.literal("video"),
        key: z.string(),
      }),
    ])
  ),
});

export const postRouter = router({
  get: publicProcedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .query(async ({ input }) => {
      return getPost(input._id);
    }),
  create: creatorProcedure.input(postSchema).mutation(async ({ input }) => {
    const session = await Post.startSession();
    session.startTransaction();
    try {
      const post = await createPost(
        {
          ...input,
          date: new Date(),
          covered: false,
        },
        session
      );
      await session.commitTransaction();
      return post;
    } catch (e) {
      await session.abortTransaction();
      throw new TRPCError({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  finalize: creatorProcedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await finalizePost(input._id);
      } catch (e) {
        throw new TRPCError({
          message: "All attachments not uploaded",
          code: "PRECONDITION_FAILED",
        });
      }
    }),
  updateDetails: creatorProcedure
    .input(
      z.object({
        _id: zodOidType,
        updateFields: postSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updatePostDetails(input._id, input.updateFields);
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  updateStatus: creatorProcedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updatePostStatus(input._id);
        return { success: true };
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getAllPosts: protectedProcedure.query(async () => {
    try {
      return await getAllPosts();
    } catch (e) {
      throw new TRPCError({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
