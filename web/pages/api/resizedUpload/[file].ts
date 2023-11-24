import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import storageClient from "../../../db/storageConnect";
import { consts } from "../../../utils/consts";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file } = req.query;
  if (req.method !== "PUT") {
    res.status(400).send("Incorrect method");
    return;
  }

  if (typeof file !== "string") {
    res.status(400).send("Incorrect");
    return;
  }

  const contentLength = Number(req.headers["content-length"] ?? "0");

  if (contentLength === 0) {
    res.status(400).send("Missing Content-Length");
    return;
  }

  try {
    const decoded = verify(file, process.env.JWT_SIGNING_KEY ?? "");
    if (typeof decoded === "string") {
      res.status(400).send("Invalid JWT");
      return;
    }
    const resizer = sharp().rotate().resize(2000, 2000, {
      fit: "inside",
    });

    const chunks = [];

    for await (const chunk of req.pipe(resizer)) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }

    const body = Buffer.concat(chunks);

    const uploadRes = await storageClient.putObject({
      Body: body,
      Key: decoded["uuid"],
      Bucket: consts.storageBucket,
      ContentLength: body.length,
    });

    res.status(200).json(uploadRes);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
}
