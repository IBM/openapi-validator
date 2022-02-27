const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');
const checkCompositeSchemaForProperty = require('./check-composite-schema-for-property');
const isDeprecated = require('./is-deprecated');
const isObject = require('./is-object');
const isSdkExcluded = require('./is-sdk-excluded');
const mergeAllOfSchemaProperties = require('./merge-allof-schema-properties');
const pathMatchesRegexp = require('./path-matches-regexp');
const validateSubschemas = require('./validate-subschemas');

module.exports = {
  checkCompositeSchemaForConstraint,
  checkCompositeSchemaForProperty,
  isDeprecated,
  isObject,
  isSdkExcluded,
  mergeAllOfSchemaProperties,
  pathMatchesRegexp,
  validateSubschemas
};
