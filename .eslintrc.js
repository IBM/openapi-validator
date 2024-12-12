module.exports = {
  plugins: ['prettier'],
  env: {
    es6: true,
    node: true,
    mocha: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'avoid',
      },
    ],
    'no-console': 0,
    'no-var': 'error',
    'prefer-const': 'error',
  },
  extends: ['prettier', 'eslint:recommended'],
  globals: {
    AggregateError: 'readonly',
  },
};
