module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  // Worklets plugin for AI voice features
  plugins.push(['react-native-worklets/plugin', {}, 'worklets']);

  // Reanimated plugin for smooth 60 FPS animations (MUST be last)
  plugins.push(['react-native-reanimated/plugin', {}, 'reanimated']);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
