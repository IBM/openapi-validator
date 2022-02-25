const isObject = require('./is-object');

/**
 * Returns `true` if the input is an object with x-sdk-exclude
 * extension set to true.
 */
const isSdkExcluded = obj => {
  return isObject(obj) && obj['x-sdk-exclude'] === true;
};

module.exports = isSdkExcluded;
