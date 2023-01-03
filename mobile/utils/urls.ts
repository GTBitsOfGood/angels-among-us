import Constants from "expo-constants";
const { manifest, expoConfig } = Constants;

const getBaseUrl = () => {
  const envUrl = expoConfig?.extra?.VERCEL_URL;
  if (
    typeof envUrl !== "string" &&
    Object.keys(envUrl).length === 0 &&
    manifest?.debuggerHost
  ) {
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
