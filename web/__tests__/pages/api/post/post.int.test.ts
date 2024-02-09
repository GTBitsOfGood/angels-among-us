declare var global: any;

import { readFileSync } from "fs";
import {
  createRandomFeedPost,
  createRandomPost,
  randomFeedPosts,
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
      const coveredPost = { ...createRandomFeedPost(), covered: true };
      const uncoveredPost = { ...createRandomFeedPost(), covered: false };

      const createCoveredPost = await Post.create(coveredPost);
      expect(createCoveredPost).not.toBeNull();

      const createUncoveredPost = await Post.create(uncoveredPost);
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
        postFilters,
      });
      expect(filteredPosts.length).toBe(2);

      const coveredPosts = await caller.post.getFilteredPosts({
        postFilters,
        covered: true,
      });
      expect(coveredPosts.length).toBe(1);
      expect(coveredPosts[0]).toMatchObject(coveredPost);

      const uncoveredPosts = await caller.post.getFilteredPosts({
        postFilters,
        covered: false,
      });
      expect(uncoveredPosts.length).toBe(1);
      expect(uncoveredPosts[0]).toMatchObject(uncoveredPost);
    });

    test("random covered-uncovered", async () => {
      const response = await Post.insertMany(randomFeedPosts);
      expect(response).not.toBeNull();
      expect(response.length).toBe(randomPosts.length);

      const serializedFeedPosts = randomFeedPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
      }));

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
        postFilters,
      });
      expect(allPosts).not.toBeNull();
      expect(allPosts.length).toBe(randomPosts.length);

      const coveredPosts = (
        await caller.post.getFilteredPosts({
          postFilters,
          covered: true,
        })
      ).map((post) => ({ ...post, _id: post._id.toString() }));
      const expectedCoveredPosts = serializedFeedPosts
        .filter((post) => post.covered)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      expect(coveredPosts).not.toBeNull();
      expect(coveredPosts.length).toBe(expectedCoveredPosts.length);
      expect(coveredPosts).toMatchObject(expectedCoveredPosts);

      const uncoveredPosts = (
        await caller.post.getFilteredPosts({
          postFilters,
          covered: false,
        })
      ).map((post) => ({ ...post, _id: post._id.toString() }));
      expect(uncoveredPosts).not.toBeNull();

      const expectedUncoveredPosts = serializedFeedPosts
        .filter((post) => !post.covered)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      expect(uncoveredPosts.length).toBe(expectedUncoveredPosts.length);
      expect(uncoveredPosts).toMatchObject(expectedUncoveredPosts);
    });

    test("pagination", async () => {
      const response = await Post.insertMany(randomFeedPosts);
      expect(response).not.toBeNull();

      const serializedFeedPosts = randomFeedPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
      }));

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
        postFilters,
      });
      expect(allPosts).not.toBeNull();
      expect(allPosts.length).toBe(randomFeedPosts.length);

      let resultsPerPage = 4;
      let page = 2;
      const paginatedPosts = (
        await caller.post.getFilteredPosts({
          postFilters,
          resultsPerPage: resultsPerPage,
          page: page,
        })
      ).map((post) => ({ ...post, _id: post._id.toString() }));
      const expectedPaginatedPosts = serializedFeedPosts
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(resultsPerPage * (page - 1), resultsPerPage * page);

      expect(paginatedPosts).not.toBeNull();
      expect(paginatedPosts.length).toBe(expectedPaginatedPosts.length);
      expect(paginatedPosts).toMatchObject(expectedPaginatedPosts);
    });
  });
});
