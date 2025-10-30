/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^jsr:'],
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'no-redeclare': 'off',
    },
  },
]);
