import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongoose";
import { z } from "zod";
import {
  createPost,
  deletePost,
  finalizePost,
  getPost,
  getAllPosts,
  updatePostDetails,
  updatePostStatus,
  getFilteredPosts,
  getAttachments,
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
  PetKind,
  IPost,
} from "../../utils/types/post";
import { findUserByEmail } from "../../db/actions/User";
import { router, procedure } from "../trpc";
import nodemailer from "nodemailer";

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

const fosterTypeEmails: Record<FosterType, string> = {
  [FosterType.FosterMove]: "foster@angelsrescue.org",
  [FosterType.Return]: "returns@angelsrescue.org, foster@angelsrescue.org",
  [FosterType.Temporary]: "tempfoster@angelsrescue.org",
  [FosterType.Boarding]: "boardingadmin@angelsrescue.org",
  [FosterType.Shelter]: "fosteroffer@angelsrescue.org",
  [FosterType.OwnerSurrender]: "fosteroffer@angelsrescue.org",
} as const;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_EMAIL,
  port: parseInt(process.env.PORT_EMAIL as string),
  auth: {
    user: process.env.LOGIN_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

const postFilterSchema = z.object({
  type: z.array(z.nativeEnum(FosterType)),
  breed: z.array(z.nativeEnum(Breed)),
  age: z.array(z.nativeEnum(Age)),
  size: z.array(z.nativeEnum(Size)),
  gender: z.array(z.nativeEnum(Gender)),
  goodWith: z.array(z.nativeEnum(GoodWith)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained).optional(),
  spayNeuterStatus: z.nativeEnum(Trained).optional(),
});

const goodWithMap: Record<GoodWith, string> = {
  [GoodWith.Cats]: "getsAlongWithCats",
  [GoodWith.LargeDogs]: "getsAlongWithLargeDogs",
  [GoodWith.Men]: "getsAlongWithMen",
  [GoodWith.OlderChildren]: "getsAlongWithOlderKids",
  [GoodWith.SmallDogs]: "getsAlongWithSmallDogs",
  [GoodWith.Women]: "getsAlongWithWomen",
  [GoodWith.YoungChildren]: "getsAlongWithYoungKids",
} as const;

export const postRouter = router({
  get: procedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .query(async ({ input }) => {
      return getPost(input._id, true);
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
  offer: procedure
    .input(
      z.object({
        email: z.string(),
        postOid: zodOidType,
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await findUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            message: "No user with given email exists.",
            code: "BAD_REQUEST",
          });
        }
      } catch (e) {
        throw new TRPCError({
          message: "An unexpected error occured.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      try {
        const post = await getPost(input.postOid, true);
        // const email = fosterTypeEmails[post.type];
        const email = "laur3nm90@gmail.com";
        let count = 0;
        const maxTries = 3;
        while (true) {
          try {
            const info = await transporter.sendMail({
              from: '"Angels Among Us Pet Rescue Placements Platform" <bitsofgood.aau@gmail.com>',
              to: email,
              subject: "Someone is ready to foster your dog!",
              text: "User has signed up to foster dog, a stray dog.",
            });
            break;
          } catch (e) {
            if (count++ == maxTries) {
              throw new TRPCError({
                message: "Unable to send Email.",
                code: "INTERNAL_SERVER_ERROR",
              });
            }
          }
        }
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
      }
      return { success: true };
    }),
  delete: procedure
    .input(
      z.object({
        postOid: zodOidType,
      })
    )
    .mutation(async ({ input }) => {
      try {
        await deletePost(input.postOid);
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        } else {
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }
      return { success: true };
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
  getAttachments: procedure
    .input(
      z.object({
        _id: zodOidType,
      })
    )
    .query(async ({ input }) => {
      return getAttachments(input._id);
    }),
  getFilteredPosts: procedure
    .input(postFilterSchema)
    .query(async ({ input }) => {
      const houseTrained = input.houseTrained
        ? [input.houseTrained]
        : Object.values(Trained);
      const spayNeuterStatus = input.spayNeuterStatus
        ? [input.spayNeuterStatus]
        : Object.values(Trained);
      const notAllowedBehavioral = Object.values(Behavioral).filter(
        (obj) => !input.behavioral.includes(obj)
      );

      /**
       * Go through each value in GoodWith enum.
       * If the value should be filtered as yes, get the specific key from the goodWithMap and set the filter array to only yes.
       * Otherwise we don't need to filter by that enum value and can set the filter array to yes, no and unknown.
       */
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
      const filteredPosts = await getFilteredPosts(completeFilter);
      return filteredPosts;
    }),
});
