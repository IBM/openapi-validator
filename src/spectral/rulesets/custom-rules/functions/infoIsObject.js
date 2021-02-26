const isPlainObject = require('lodash/isPlainObject');

module.exports = targetVal => {
  if (!(targetVal && isPlainObject(targetVal))) {
    return [
      {
        message: 'API definition must have an `info` object'
      }
    ];
  }
};
