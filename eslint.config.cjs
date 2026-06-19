const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'simple-import-sort/imports': 'error',
    },
  },
];
