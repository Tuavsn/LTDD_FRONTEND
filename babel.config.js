module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Nếu dùng expo-router:
      "react-native-reanimated/plugin",
    ],
  };
};
