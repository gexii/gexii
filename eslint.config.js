const { dirname } = require('path');
const tsEslint = require('typescript-eslint');
const { FlatCompat } = require('@eslint/eslintrc');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

const compat = new FlatCompat({
  baseDirectory: dirname(__filename),
});

module.exports = tsEslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [
    ...compat.extends(
      'plugin:react/recommended',
      'eslint-config-airbnb-base',
      'plugin:@typescript-eslint/recommended',
    ),
    eslintPluginPrettierRecommended,
  ],
  languageOptions: {
    parser: tsEslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-use-before-define': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-exports': 'off',
    'no-shadow': 'off',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
});
