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
  getFilteredPosts,
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
  PetKind,
} from "../../utils/types/post";
import { router, procedure } from "../trpc";

const zodOidType = z.custom<ObjectId>((item) => String(item).length == 24);

const postSchema = z.object({
  name: z.string(),
  description: z.string(),
  petKind: z.nativeEnum(PetKind),
  type: z.nativeEnum(FosterType),
  size: z.nativeEnum(Size),
  breed: z.array(z.nativeEnum(Breed)),
  gender: z.nativeEnum(Gender),
  age: z.nativeEnum(Age),
  temperament: z.array(z.nativeEnum(Temperament)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained),
  crateTrained: z.nativeEnum(Trained),
  spayNeuterStatus: z.nativeEnum(Trained),
  getsAlongWithMen: z.nativeEnum(Trained),
  getsAlongWithWomen: z.nativeEnum(Trained),
  getsAlongWithOlderKids: z.nativeEnum(Trained),
  getsAlongWithYoungKids: z.nativeEnum(Trained),
  getsAlongWithLargeDogs: z.nativeEnum(Trained),
  getsAlongWithSmallDogs: z.nativeEnum(Trained),
  getsAlongWithCats: z.nativeEnum(Trained),
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

//TODO: Update goodWith
const postFilterSchema = z.object({
  type: z.array(z.nativeEnum(FosterType)),
  breed: z.array(z.nativeEnum(Breed)),
  age: z.array(z.nativeEnum(Age)),
  size: z.array(z.nativeEnum(Size)),
  gender: z.array(z.nativeEnum(Gender)),
  goodWith: z.array(z.nativeEnum(GoodWith)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained).optional(),
  spayNeuterStatus: z.nativeEnum(Status).optional(),
});

export const postRouter = router({
  get: procedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .query(async ({ input }) => {
      return getPost(input._id);
    }),
  create: procedure.input(postSchema).mutation(async ({ input }) => {
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
      console.error(e);
      throw new TRPCError({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  finalize: procedure
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
  updateDetails: procedure
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
  updateStatus: procedure
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
  getAllPosts: procedure.query(async () => {
    try {
      return await getAllPosts();
    } catch (e) {
      throw new TRPCError({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  getFilteredPosts: procedure
    .input(postFilterSchema)
    .query(async ({ input }) => {
      const houseTrained = input.houseTrained
        ? [input.houseTrained]
        : Object.values(Trained);
      const spayNeuterStatus = input.spayNeuterStatus
        ? [input.spayNeuterStatus]
        : Object.values(Status);
      const notAllowedBehavioral = Object.values(Behavioral).filter(
        (obj) => !input.behavioral.includes(obj)
      );
      const goodWithMap: Record<GoodWith, string> = {
        [GoodWith.Cats]: "getsAlongWithCats",
        [GoodWith.LargeDogs]: "getsAlongWithLargeDogs",
        [GoodWith.Men]: "getsAlongWithMen",
        [GoodWith.OlderChildren]: "getsAlongWithOlderKids",
        [GoodWith.SmallDogs]: "getsAlongWithSmallDogs",
        [GoodWith.Women]: "getsAlongWithWomen",
        [GoodWith.YoungChildren]: "getsAlongWithYoungKids",
      };

      const getsAlongWith: Record<string, Trained> = Object.values(
        GoodWith
      ).reduce((acc, curr) => {
        if (input.goodWith.includes(curr)) {
          return { ...acc, ...{ [goodWithMap[curr]]: [Trained.Yes] } };
        } else {
          return {
            ...acc,
            ...{
              [goodWithMap[curr]]: [Trained.Yes, Trained.No, Trained.Unknown],
            },
          };
        }
      }, {});

      let completeFilter = {
        breed: { $in: input.breed },
        type: { $in: input.type },
        age: { $in: input.age },
        size: { $in: input.size },
        gender: { $in: input.gender },
        behavioral: { $nin: notAllowedBehavioral },
        getsAlongWithCats: { $in: getsAlongWith["getsAlongWithCats"] },
        getsAlongWithLargeDogs: {
          $in: getsAlongWith["getsAlongWithLargeDogs"],
        },
        getsAlongWithMen: { $in: getsAlongWith["getsAlongWithMen"] },
        getsAlongWithOlderKids: {
          $in: getsAlongWith["getsAlongWithOlderKids"],
        },
        getsAlongWithSmallDogs: {
          $in: getsAlongWith["getsAlongWithSmallDogs"],
        },
        getsAlongWithWomen: { $in: getsAlongWith["getsAlongWithWomen"] },
        getsAlongWithYoungKids: {
          $in: getsAlongWith["getsAlongWithYoungKids"],
        },
        houseTrained: { $in: houseTrained },
        spayNeuterStatus: { $in: spayNeuterStatus },
      };
      return await getFilteredPosts(completeFilter);
    }),
});
