module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "jest",
    },
    binary: {
      version: "4.0.2", // Version of MongoDB
      skipMD5: true,
    },
    autoStart: false,
    replSet: {
      count: 3,
      storageEngine: "wiredTiger",
    },
  },
};
