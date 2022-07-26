module.exports = {
  'plugins': ['prettier'],
  'env': {
    'es6': false,
    'node': false,
    'mocha': false,
    'jest': false,
  },
  'parser': 'babel-eslint',
  'rules': {
    'prettier/prettier': ['error', {'singleQuote': false}],
    'no-console': 0,
  },]
};
