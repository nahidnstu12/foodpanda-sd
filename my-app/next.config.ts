const path = require("path");

module.exports = {
  webpack: (config) => {
    // Prevent webpack from trying to scan Windows system dirs
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.git',
        path.resolve('C:/Users/Imtiaz/Application Data')
      ],
    };
    return config;
  },
};
