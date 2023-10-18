declare var global: any;

import { readFileSync } from "fs";
import {
  createRandomPost,
  randomPosts,
} from "../../../../db/actions/__mocks__/Post";
import { consts } from "../../../../utils/consts";
import storageClient from "../../../../db/storageConnect";
import mongoose, { ConnectOptions } from "mongoose";
import { appRouter } from "../../../../server/routers/_app";
import { createContextInner } from "../../../../server/context";
import Post from "../../../../db/models/Post";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Size,
} from "../../../../utils/types/post";
import { userAgentFromString } from "next/server";

const noResizeData = readFileSync("./__tests__/assets/no-resize.png");
const videoData = readFileSync("./__tests__/assets/video.mp4");

// Mocks procedures without authentication session
jest.mock("../../../../server/trpc");

// Mocks context without db connection
jest.mock("../../../../server/context");

async function simulateAuthenticatedSession() {
  const context = await createContextInner();
  const caller = appRouter.createCaller(context);
  return caller;
}

const goodWithMap: Record<string, GoodWith> = {
  getsAlongWithCats: GoodWith.Cats,
  getsAlongWithLargeDogs: GoodWith.LargeDogs,
  getsAlongWithMen: GoodWith.Men,
  getsAlongWithOlderKids: GoodWith.OlderChildren,
  getsAlongWithSmallDogs: GoodWith.SmallDogs,
  getsAlongWithWomen: GoodWith.Women,
  getsAlongWithYoungKids: GoodWith.YoungChildren,
} as const;

/**
 * Tests post API endpoints and integration with db. DB actions hit an
 * in-memory MongoDB database. Storage bucket calls hit a development bucket.
 *
 * @group api/post
 * @group api
 * @group int
 */
describe("[API] Post - Integration Test", () => {
  beforeAll(async () => {
    mongoose
      .connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
      } as ConnectOptions)
      .then(
        (instance) => {
          instance.connection.db.admin().command({
            setParameter: 1,
            maxTransactionLockRequestTimeoutMillis: 5000,
          });
        },
        (err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
        }
      );
    await Post.createCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("post.delete", () => {
    let caller: ReturnType<typeof appRouter.createCaller>;

    const id = new mongoose.Types.ObjectId();
    const idString = id.toString();
    const attachmentBodyMap = {
      "no-resize.png": noResizeData,
      "video.mp4": videoData,
    } as const;

    const attachments: Array<keyof typeof attachmentBodyMap> = [
      "no-resize.png",
      "video.mp4",
    ];

    beforeAll(async () => {
      caller = await simulateAuthenticatedSession();
    });

    beforeEach(async () => {
      jest.restoreAllMocks();
      const samplePost = createRandomPost();
      const post = await Post.create({
        ...samplePost,
        _id: id,
        attachments,
      });
      expect(post).not.toBeNull();

      for (const attachment of attachments) {
        const res = await storageClient.putObject({
          Key: `${idString}/${attachment}`,
          Bucket: consts.storageBucket,
          Body: attachmentBodyMap[attachment],
          ContentLength: attachmentBodyMap[attachment].length,
        });
        expect(res.$metadata.httpStatusCode).toBe(200);
      }
      const objects = await storageClient.listObjectsV2({
        Bucket: consts.storageBucket,
        Prefix: idString,
      });

      expect(objects.Contents).not.toBeUndefined();
      expect(objects.Contents!.length).toBe(attachments.length);
    });

    afterEach(async () => {
      jest.restoreAllMocks();
      await storageClient.deleteObjects({
        Bucket: consts.storageBucket,
        Delete: {
          Objects: attachments.map((attachment) => ({
            Key: `${id}/${attachment}`,
          })),
        },
      });
      await Post.deleteMany({});
    });

    test("happy", async () => {
      const res = await caller.post.delete({
        postOid: id,
      });
      expect(res.success).toBe(true);

      const post = await Post.findById(id);
      expect(post).toBeNull();
    });

    test("bucket object deletion failure, expect successful post deletion", async () => {
      const spy = jest.spyOn(storageClient, "send").mockImplementation(() => {
        throw new Error();
      });

      const res = await caller.post.delete({
        postOid: id,
      });
      expect(spy).toHaveBeenCalledTimes(3);
      expect(res.success).toBe(true);

      const post = await Post.findById(id);
      expect(post).toBeNull();
    });
  });

  describe("post.getFilteredPosts", () => {
    let caller: ReturnType<typeof appRouter.createCaller>;
    beforeAll(async () => {
      caller = await simulateAuthenticatedSession();
    });

    beforeEach(async () => {
      jest.restoreAllMocks();
    });

    afterEach(async () => {
      jest.restoreAllMocks();
      await Post.deleteMany({});
    });

    test("singleton covered-uncovered", async () => {
      const post = createRandomPost();
      const coveredId = new mongoose.Types.ObjectId();
      const createCoveredPost = await Post.create({
        ...post,
        _id: coveredId,
        covered: true,
      });
      expect(createCoveredPost).not.toBeNull();
      const uncoveredId = new mongoose.Types.ObjectId();
      const createUncoveredPost = await Post.create({
        ...post,
        _id: uncoveredId,
        covered: false,
      });
      expect(createUncoveredPost).not.toBeNull();
      const postFilters = {
        type: Object.values(FosterType),
        breed: Object.values(Breed),
        age: Object.values(Age),
        size: Object.values(Size),
        gender: Object.values(Gender),
        behavioral: Object.values(Behavioral),
        goodWith: [],
      };
      const filteredPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
      });
      expect(filteredPosts).not.toBeNull();
      expect(filteredPosts.length).toBe(2);
      const coveredPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
        covered: true,
      });
      expect(coveredPosts).not.toBeNull();
      expect(coveredPosts.length).toBe(1);
      expect(coveredPosts[0]._id).toMatchObject(coveredId);
      const uncoveredPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
        covered: false,
      });
      expect(uncoveredPosts).not.toBeNull();
      expect(uncoveredPosts.length).toBe(1);
      expect(uncoveredPosts[0]._id).toMatchObject(uncoveredId);
    });

    test("random covered-uncovered", async () => {
      const randPosts = randomPosts;
      const response = await Post.insertMany(randPosts);
      expect(response).not.toBeNull();
      expect(response.length).toBe(10);
      const postFilters = {
        type: Object.values(FosterType),
        breed: Object.values(Breed),
        age: Object.values(Age),
        size: Object.values(Size),
        gender: Object.values(Gender),
        behavioral: Object.values(Behavioral),
        goodWith: [],
      };
      const allPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
      });
      expect(allPosts).not.toBeNull();
      expect(allPosts.length).toBe(randPosts.length);
      let expected = allPosts.map((post) => {
        const { _id, __v, pending, ...postWithoutId } = post._doc;
        return postWithoutId;
      });
      expect(expected).toEqual(expect.arrayContaining(randPosts));
      const coveredPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
        covered: true,
      });
      expect(coveredPosts).not.toBeNull();
      const expectedCoveredPosts = randomPosts.filter((post) => post.covered);
      expected = coveredPosts.map((post) => {
        const { _id, __v, pending, ...postWithoutMisc } = post._doc;
        return postWithoutMisc;
      });
      expect(coveredPosts.length).toBe(expected.length);
      expect(expected).toEqual(expect.arrayContaining(expectedCoveredPosts));
      const uncoveredPosts = await caller.post.getFilteredPosts({
        postFilterSchema: postFilters,
        covered: false,
      });
      expect(uncoveredPosts).not.toBeNull();
      const expectedUncoveredPosts = randomPosts.filter(
        (post) => !post.covered
      );
      expected = uncoveredPosts.map((post) => {
        const { _id, __v, pending, ...postWithoutMisc } = post._doc;
        return postWithoutMisc;
      });
      expect(expected.length).toBe(expectedUncoveredPosts.length);
      expect(expected).toEqual(expect.arrayContaining(expectedUncoveredPosts));
    });
  });
});
