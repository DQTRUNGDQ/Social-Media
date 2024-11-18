import defaultConfig from "./default";

const developmentConfig = {
  ...defaultConfig,
  app: {
    ...defaultConfig.app,
    debug: true,
  },
  logger: {
    ...defaultConfig.logger,
    level: "debug",
  },
};

export default developmentConfig;
