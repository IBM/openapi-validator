const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * Returns `true` if the input is an object with deprecated=true.
 */
const isDeprecated = obj => {
  return isObject(obj) && obj.deprecated === true;
};

module.exports = isDeprecated;
