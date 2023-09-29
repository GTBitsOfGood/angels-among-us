import { readFileSync } from "fs";
import { createRandomPost } from "../../../../db/actions/__mocks__/Post";
import { consts } from "../../../../utils/consts";
import storageClient from "../../../../db/storageConnect";

const noResizeData = readFileSync("./__tests__/assets/no-resize.png");
const resizeData = readFileSync("./__tests__/assets/resize.png");
const videoData = readFileSync("./__tests__/assets/video.mp4");

jest.setTimeout(10000);

async function sendCreateReq() {
  const randPost = createRandomPost();
  return fetch("http://localhost:3000/api/trpc/post.create", {
    method: "POST",
    body: JSON.stringify({
      ...randPost,
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

describe.skip("[Post] Delete Post - Integration Test", () => {
  test("delete post and attachments with different uploads", async () => {
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

    //check if delete post is successful on mongoose object
    const deletePostResponse = await fetch(
      "http://localhost:3000/api/trpc/post.delete",
      {
        method: "POST",
        body: JSON.stringify({
          postOid: oid,
        }),
      }
    );
    expect(deletePostResponse.status).toBe(200);

    const deletePostSuccess = await deletePostResponse.json();
    expect(deletePostSuccess["result"]["data"]["success"]).toBe(true);

    const post = await fetch(
      `http://localhost:3000/api/trpc/post.get?input={"_id":"${oid}"}`,
      {
        method: "GET",
      }
    );
    expect(post.status).toBe(200);

    const getPostSuccess = await post.json();
    expect(getPostSuccess["result"]["data"]).toBe(null);

    //check if attachments are all deleted in storage bucket
    const attach = await fetch(
      `http://localhost:3000/api/trpc/post.getAttachments?input={"_id":"${oid}"}`,
      {
        method: "GET",
      }
    );
    const attachmentsInfo = await attach.json();
    expect(attachmentsInfo["result"]["data"]["Contents"]).toBe(undefined);
  });
});
