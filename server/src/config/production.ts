import defaultConfig from "./default";

const productionConfig = {
  ...defaultConfig,
  app: {
    ...defaultConfig.app,
    debug: false,
  },
  logger: {
    ...defaultConfig.logger,
    level: "error",
  },
};

export default productionConfig;
