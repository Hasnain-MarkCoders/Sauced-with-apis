module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv', {
        envName: '.env',        // Note: This should be "moduleName" if specifying the module, not "envName".
        moduleName: '@env',     // Correct property for specifying the module's name.
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      }
    ]
  ],
};
