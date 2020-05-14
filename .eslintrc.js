module.exports = {
  'plugins': ['prettier'],
  'env': {
    'es6': true,
    'node': true,
    'mocha': true,
    'jest': true,
  },
  'parser': 'babel-eslint',
  'rules': {
    'prettier/prettier': ['error', {'singleQuote': true}],
    'no-console': 0,
    'no-var': 'error',
    'prefer-const': 'error',
  },
  'extends': ['prettier', 'eslint:recommended']
};
