"use strict";

module.exports = {
  //   useFileSystemPublicRoutes: false,
  webpack(config, { dev }) {
    if (true) {
      //TODO
      config.devtool = "cheap-module-eval-source-map";
    }
    return config;
  },
};
