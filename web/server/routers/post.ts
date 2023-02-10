import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPost } from "../../db/actions/Post";
import {
  Age,
  Behavioral,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  Size,
  Status,
  Temperament,
  Trained,
} from "../../db/models/Post";
import { router, creatorProcedure } from "../trpc";

const postSchema = z.object({
  type: z.nativeEnum(FosterType),
  size: z.nativeEnum(Size),
  gender: z.nativeEnum(Gender),
  age: z.nativeEnum(Age),
  temperament: z.nativeEnum(Temperament),
  goodWith: z.array(z.nativeEnum(GoodWith)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained),
  crateTrained: z.nativeEnum(Trained),
  spayNeuterStatus: z.nativeEnum(Status),
  attachments: z.array(z.string()),
});

export const postRouter = router({
  create: creatorProcedure.input(postSchema).mutation(async ({ input }) => {
    try {
      const post = await createPost({
        ...input,
        date: new Date(),
        covered: false,
      });
      return post;
    } catch (e) {
      throw new TRPCError({
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
