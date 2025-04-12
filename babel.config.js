module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo"]
    ],
    plugins: [
      // Nếu dùng expo-router:
      "react-native-reanimated/plugin",
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env'
      }]
    ],
  };
};
