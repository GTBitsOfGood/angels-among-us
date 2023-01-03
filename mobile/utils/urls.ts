import Constants from "expo-constants";
const { manifest, expoConfig } = Constants;

const getBaseUrl = () => {
  if (!expoConfig?.extra?.VERCEL_URL && manifest?.debuggerHost) {
    return ("http://" +
      manifest.debuggerHost.split(":").shift()?.concat(":3000")) as string;
  } else {
    return expoConfig?.extra?.VERCEL_URL as string;
  }
};

const urls = {
  baseUrl: getBaseUrl(),
  api: {
    test: "/api/hello",
  },
};

export { urls };
