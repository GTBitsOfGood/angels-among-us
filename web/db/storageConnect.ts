import { S3 } from "@aws-sdk/client-s3";
import { consts } from "../utils/consts";

const storageClient = new S3({
  endpoint: consts.storageS3Endpoint,
  region: consts.storageS3Region,
  credentials: {
    accessKeyId: process.env.STORAGE_KEY_ID ?? "",
    secretAccessKey: process.env.STORAGE_APPLICATION_KEY ?? "",
  },
});

export default storageClient;
