enum Pages {
  FEED = "/",
  ACCESS_MANAGEMENT = "/access",
  ONBOARDING = "/onboarding",
}

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const consts = {
  dbUrl: process.env.DB_URL,
  dbName: "angels-among-us",
  pages: Object.values(Pages),
  baseUrl: getBaseUrl(),
  b2Bucket: process.env.B2_BUCKET_NAME,
};

export { Pages, consts };
