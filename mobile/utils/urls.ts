import Constants from "expo-constants";
const { manifest } = Constants;

const getBaseUrl = () => {
  if (
    typeof manifest?.packagerOpts === "object" &&
    manifest.packagerOpts.dev &&
    manifest.debuggerHost
  ) {
    return ("http://" +
      manifest.debuggerHost.split(":").shift()?.concat(":3000")) as string;
  } else {
    return ("https://" + process.env.VERCEL_URL) as string;
  }
};

const urls = {
  baseUrl: getBaseUrl(),
  api: {
    test: "/api/hello",
  },
};

export { urls };
