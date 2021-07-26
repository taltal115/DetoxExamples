// This config file is used for script bundle-android in package.json
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const watchFolders = [path.resolve('src')];
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-typescript-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // resolver: {
  // 	sourceExts: ['ts', 'tx']
  // }, 
  resolver: {
    blacklistRE: blacklist([/.git\/bit\/.*/, /^[^/]components\/(?!.*dist).*/]),
    sourceExts: process.env.DETOX_TEST ? ['e2e.ts'].concat(defaultSourceExts) : defaultSourceExts
  },
  watchFolders,
};
