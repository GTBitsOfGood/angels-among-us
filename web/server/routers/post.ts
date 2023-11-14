import { TRPCError } from "@trpc/server";
import { z, ZodArray } from "zod";
import {
  createPost,
  deletePost,
  finalizePost,
  getPost,
  getAllPosts,
  updatePostStatus,
  getFilteredPosts,
  getAttachments,
  finalizePostEdit,
  pushUserAppliedTo,
  getUserContextualizedPost,
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
  IPost,
} from "../../utils/types/post";
import { findUserByEmail, updateUserByUid } from "../../db/actions/User";
import { router, procedure } from "../trpc";
import nodemailer from "nodemailer";
import { FilterQuery, Types } from "mongoose";
import { populateEmailTemplate } from "../../email/email-template";
import inlineCss from "inline-css";

const zodOidType = z.custom<Types.ObjectId>(
  (item) => String(item).length == 24
);

const questionnaireSchema = z.array(
  z.object({
    key: z.string(),
    answer: z.string(),
  })
);

const postSchema = z.object({
  name: z.string(),
  description: z.string(),
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
    .query(async ({ input, ctx }) => {
      try {
        return getUserContextualizedPost(input._id, ctx.session.uid, true);
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
        });
      }
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
          usersAppliedTo: [],
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
        cause: e,
      });
    }
  }),
  offer: procedure
    .input(
      z.object({
        email: z.string(),
        postOid: zodOidType,
        responses: questionnaireSchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await findUserByEmail(input.email);
        if (!user) {
          throw new Error("No user with given email exists");
        }
        const post = await getPost(input.postOid, true);
        if (!post) {
          throw new Error("No post with given id exists.");
        }
        const email =
          process.env.CONTEXT === "production"
            ? fosterTypeEmails[post.type]
            : input.email;

        const emailBody = populateEmailTemplate(post, user, input.responses);

        let count = 0;
        const maxTries = 3;
        const options = { url: "www.angelsrescue.org" };
        while (true) {
          try {
            const emailFormatted = await inlineCss(emailBody, options);
            await transporter.sendMail({
              from: '"Angels Among Us Pet Rescue Placements Platform" <bitsofgood.aau@gmail.com>',
              to: email,
              subject: `[OFFER] ${user.name ?? "Volunteer"} <> ${post.name}`,
              html: emailFormatted,
            });
            break;
          } catch (e) {
            if (++count == maxTries) {
              throw new TRPCError({
                message: "Unable to send Email.",
                code: "INTERNAL_SERVER_ERROR",
                cause: e,
              });
            }
          }
        }
        await pushUserAppliedTo(input.postOid, user.uid);
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
            cause: e,
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
        return await deletePost(input.postOid);
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        } else {
          throw new TRPCError({
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR",
            cause: e,
          });
        }
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
          cause: e,
        });
      }
    }),
  finalizeEdit: procedure
    .input(
      z.object({
        oldId: zodOidType,
        newId: zodOidType,
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await finalizePostEdit(input.oldId, input.newId);
      } catch (e) {
        throw new TRPCError({
          message: "All attachments not uploaded",
          code: "PRECONDITION_FAILED",
          cause: e,
        });
      }
    }),
  /**
   * `editPost` does not actually edit the target post id:
   * - A new post document is created (new _id) with the updated fields (post-edit)
   * - The updated attachments are uploaded with the new post id as the prefix for the object key
   * - The old document and its attachments are deleted
   */
  editPost: procedure
    .input(
      z.object({
        _id: zodOidType,
        updateFields: postSchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        const existingPost = await getPost(input._id, false);
        if (!existingPost) {
          throw new Error("Unable to find existing post id.");
        }
        const newPost = await createPost({
          ...input.updateFields,
          date: existingPost.date,
          covered: existingPost.covered,
          usersAppliedTo: existingPost.usersAppliedTo,
        });
        return newPost;
      } catch (e) {
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
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
          cause: e,
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
        cause: e,
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
      try {
        return getAttachments(input._id);
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          cause: e,
        });
      }
    }),
  getFilteredPosts: procedure
    .input(
      z.object({
        postFilters: postFilterSchema,
        covered: z.optional(z.boolean()),
      })
    )
    .query(async ({ input, ctx }) => {
      const postFilters = input.postFilters;
      const notAllowedBehavioral = Object.values(Behavioral).filter(
        (obj) => !postFilters.behavioral.includes(obj)
      );

      /**
       * Go through each value in GoodWith enum.
       * If the value should be filtered as yes, get the specific key from the goodWithMap and set the filter array to only yes.
       * Otherwise we don't need to filter by that enum value and can set the filter array to yes, no and unknown.
       */
      const getsAlongWith: Record<string, Trained> = Object.values(
        GoodWith
      ).reduce((acc, curr) => {
        if (postFilters.goodWith.includes(curr)) {
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

      const baseFilter: FilterQuery<IPost> = {
        breed: { $in: postFilters.breed },
        type: { $in: postFilters.type },
        age: { $in: postFilters.age },
        size: { $in: postFilters.size },
        gender: { $in: postFilters.gender },
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
        pending: false,
      };
      if (input.covered !== undefined) {
        baseFilter.covered = input.covered;
      }

      try {
        const filteredPosts = await getFilteredPosts(
          baseFilter,
          ctx.session.uid
        );
        return filteredPosts;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
          cause: e,
        });
      }
    }),
});
