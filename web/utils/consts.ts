enum Pages {
  FEED = "/",
  ACCESS_MANAGEMENT = "/access",
  ONBOARDING = "/onboarding",
}

const consts = {
  dbUrl: process.env.DB_URL,
  dbName: "angels-among-us",
  pages: Object.values(Pages),
};

export { Pages, consts };
