enum Pages {
  FEED = "/",
  ACCESS_MANAGEMENT = "/access",
  ONBOARDING = "/onboarding",
  PROFILE = "/profile",
  RESOURCES = "/resources",
  USERS = "/users",
}

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.URL)
    // reference for vercel.com
    return `https://${process.env.URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const consts = {
  dbUrl: process.env.DB_URL,
  pages: Object.values(Pages),
  baseUrl: getBaseUrl(),
  storageBucket: process.env.STORAGE_BUCKET_NAME,
  storageS3Endpoint: process.env.STORAGE_S3_ENDPOINT,
  storageS3Region: process.env.STORAGE_S3_REGION,
  storageBucketURL: process.env.STORAGE_BUCKET_URL,
} as const;

export { Pages, consts };
