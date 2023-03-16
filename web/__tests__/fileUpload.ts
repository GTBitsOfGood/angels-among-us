import { readFileSync } from "fs";
import storageClient from "../db/storageConnect";
import { consts } from "../utils/consts";

const noResizeData = readFileSync("./__tests__/assets/no-resize.png");
const resizeData = readFileSync("./__tests__/assets/resize.png");
const videoData = readFileSync("./__tests__/assets/video.mp4");

jest.setTimeout(10000);

async function sendCreateReq() {
  return fetch("http://localhost:3000/api/trpc/post.create", {
    method: "POST",
    body: JSON.stringify({
      type: "return",
      breed: "corgi",
      size: "xs",
      gender: "male",
      age: "puppy",
      temperament: "calm",
      goodWith: ["men"],
      medical: [],
      behavioral: ["barking"],
      houseTrained: "yes",
      crateTrained: "yes",
      spayNeuterStatus: "no",
      attachments: [
        {
          type: "image",
          width: 2200,
          length: 2259,
          key: "resizedImage",
        },
        {
          type: "image",
          width: 1000,
          length: 842,
          key: "nonResizedImage",
        },
        {
          type: "video",
          key: "video",
        },
      ],
    }),
  });
}

describe("File Upload - Integration Test", () => {
  test("With resize, non-resize, and video", async () => {
    const response = await sendCreateReq();
    expect(response.status).toBe(200);
    const json = await response.json();
    const attachments = json["result"]["data"]["attachments"];
    const oid = json["result"]["data"]["_id"];
    // Upload no-resize
    const resultNoResize = await fetch(attachments[`${oid}/nonResizedImage`], {
      method: "PUT",
      body: noResizeData,
      headers: {
        "Content-Length": `${noResizeData.length}`,
      },
    });
    expect(resultNoResize.status).toBe(200);

    // Upload with resize
    const resultResize = await fetch(attachments[`${oid}/resizedImage`], {
      method: "PUT",
      body: resizeData,
      headers: {
        "Content-Length": `${resizeData.length}`,
      },
    });
    expect(resultResize.status).toBe(200);

    // Upload video
    const resultVideo = await fetch(attachments[`${oid}/video`], {
      method: "PUT",
      body: videoData,
      headers: {
        "Content-Length": `${videoData.length}`,
      },
    });
    expect(resultVideo.status).toBe(200);

    const finalize = await fetch(
      "http://localhost:3000/api/trpc/post.finalize",
      {
        method: "POST",
        body: JSON.stringify({
          _id: oid,
        }),
      }
    );
    expect(finalize.status).toBe(200);
    const postData = await finalize.json();
    expect(postData["result"]["data"]["pending"]).toBe(false);

    const testObjInfo: Record<string, any> = {
      resizedImage: {
        length: resizeData.length,
        shouldEqual: false,
      },
      nonResizedImage: {
        length: noResizeData.length,
        shouldEqual: true,
      },
      video: {
        length: videoData.length,
        shouldEqual: true,
      },
    };

    const objectInfo = await storageClient.listObjectsV2({
      Bucket: consts.storageBucket,
      Prefix: oid,
    });

    for (let i = 0; i < objectInfo.Contents!.length; i++) {
      const info = objectInfo.Contents![i];
      const testInfo = testObjInfo[info.Key!.replace(`${oid}/`, "")];
      expect(testInfo.length === info.Size).toBe(testInfo.shouldEqual);
    }
  });

  test("Finalize without Uploads", async () => {
    const response = await sendCreateReq();
    expect(response.status).toBe(200);
    const json = await response.json();
    const oid = json["result"]["data"]["_id"];
    const finalize = await fetch(
      "http://localhost:3000/api/trpc/post.finalize",
      {
        method: "POST",
        body: JSON.stringify({
          _id: oid,
        }),
      }
    );
    expect(finalize.status).toBe(412);
  });
});
