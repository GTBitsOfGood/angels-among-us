export default () => ({
  expo: {
    name: "mobile",
    slug: "angels-among-us",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bitsofgood.aau.angelsamongus",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.bitsofgood.aau.angelsamongus",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    owner: "bitsofgood.aau",
    runtimeVersion: {
      policy: "sdkVersion",
    },
    extra: {
      eas: {
        projectId: "ffd1ce48-877d-4488-8b33-9ffb9c814e1c",
      },
      VERCEL_URL: process.env.VERCEL_URL || null,
    },
    updates: {
      url:
        process.env.VERCEL_URL &&
        "https://u.expo.dev/ffd1ce48-877d-4488-8b33-9ffb9c814e1c",
    },
  },
});
