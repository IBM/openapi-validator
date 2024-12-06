/**
 * @file
 * @copyright IBM Corporation 2017–2024
 * @license Apache-2.0
 */

const isObject = require('./is-object');

/**
 * Returns an array of property names for a simple or composite schema,
 * optionally filtered by a lambda function.
 * @param {object} schema simple or composite OpenAPI 3.0 schema object
 * @param {Function} propertyFilter a `(schema) => boolean` function to perform filtering
 * @returns {Array} property names
 */
function getPropertyNamesForSchema(schema, propertyFilter = () => true) {
  const propertyNames = [];

  if (!isObject(schema)) {
    return propertyNames;
  }

  if (isObject(schema.properties)) {
    for (const propertyName of Object.keys(schema.properties)) {
      if (propertyFilter(propertyName, schema.properties[propertyName])) {
        propertyNames.push(propertyName);
      }
    }
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      for (const applicatorSchema of schema[applicatorType]) {
        propertyNames.push(
          ...getPropertyNamesForSchema(applicatorSchema, propertyFilter)
        );
      }
    }
  }

  return [...new Set(propertyNames)]; // de-duplicate
}

module.exports = getPropertyNamesForSchema;
