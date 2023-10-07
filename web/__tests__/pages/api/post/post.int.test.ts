declare var global: any;

import { readFileSync } from "fs";
import { createRandomPost } from "../../../../db/actions/__mocks__/Post";
import { deleteAttachments } from "../../../../db/actions/Post";
import { consts } from "../../../../utils/consts";
import storageClient from "../../../../db/storageConnect";
import mongoose, { ConnectOptions } from "mongoose";
import { appRouter } from "../../../../server/routers/_app";
import { createContextInner } from "../../../../server/context";
import Post from "../../../../db/models/Post";

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
});
