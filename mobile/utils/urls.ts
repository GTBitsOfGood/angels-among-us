import { VERCEL_URL } from "@env";
import Constants from "expo-constants";
const { manifest } = Constants;

const getBaseUrl = () => {
  if (!process.env.VERCEL_URL && manifest?.debuggerHost) {
    return ("http://" +
      manifest.debuggerHost.split(":").shift()?.concat(":3000")) as string;
  } else {
    return ("https://" + VERCEL_URL) as string;
  }
};

const urls = {
  baseUrl: getBaseUrl(),
  api: {
    test: "/api/hello",
  },
};

export { urls };
