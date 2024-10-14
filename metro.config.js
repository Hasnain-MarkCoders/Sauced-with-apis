const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = {
  resolver: {
    blacklistRE: exclusionList([
      /node_modules\/.*\/node_modules\/react-native\/.*/, // Exclude nested react-native modules
      /android\/.*/,
      /ios\/.*/,
      /dist\/.*/,
      /build\/.*/,
      /.*\.test\.js$/, // Exclude test files
      /.*\.spec\.js$/,
      /.*\.stories\.js$/, // Exclude Storybook files if any
    ]),
  },
  watchFolders: [
    require('path').resolve(__dirname, 'src'), // Specify only essential folders
  ],
  transformer: {
    // Only include if using react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
