const globals = require("globals");
const eslint = require("@eslint/js").configs.recommended;
const prettier = require('eslint-plugin-prettier/recommended');
const jsdoc = require("eslint-plugin-jsdoc").configs['flat/recommended'];
const jest = require('eslint-plugin-jest').configs['flat/recommended'];

module.exports = [
  {
    ...jsdoc,
    files: ["packages/utilities/**/*.js"],
    ignores: [
      "**/*.test.js",
    ]
  },
  {
    ...eslint,
    files: ["**/*.js"],
    ignores: ["**/*.test.js"],
  },
  {
    ...prettier,
    files: ["**/*.js"],
    ignores: ["**/*.test.js"],
    languageOptions: {
      ecmaVersion: 13,
      globals: {
        ...globals.node,
        mocha: true,
        jest: true,
        'AggregateError': 'readonly',
      }
    },
    rules: {
      ...prettier.rules,
      'prettier/prettier': ['error', {
        'singleQuote': true,
        'arrowParens': 'avoid',
        'trailingComma': 'es5',
      }],
    }
  },
  {
    'rules': {
      'jsdoc/require-returns-description': 'off',
      'no-console': 0,
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
];
