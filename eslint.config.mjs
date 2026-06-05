import globals from 'globals';
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    ...eslint.configs.recommended,
    files: ['**/*.js'],
    ignores: ['**/*.test.js'],
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
        ...globals.mocha,
      },
    },
  },
  {
    ...prettier,
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 13,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021,
        AggregateError: 'readonly',
      },
    },
    rules: {
      ...prettier.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          arrowParens: 'avoid',
          trailingComma: 'es5',
        },
      ],
      'no-console': 0,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
