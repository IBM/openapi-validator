/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const isObject = require('./is-object');
/**
 * @private
 */
const collectFromComposedSchemas = require('./collect-from-composed-schemas');

/**
 * Returns an array of property names for a simple or composite schema,
 * optionally filtered by a lambda function.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} propertyFilter a `(propertyName, propertySchema) => boolean` function to perform filtering
 * @returns {Array} property names
 */
function getPropertyNamesForSchema(schema, propertyFilter = () => true) {
  return collectFromComposedSchemas(schema, s => {
    const propertyNames = [];

    if (isObject(s.properties)) {
      for (const propertyName of Object.keys(s.properties)) {
        if (propertyFilter(propertyName, s.properties[propertyName])) {
          propertyNames.push(propertyName);
        }
      }
    }

    return propertyNames;
  });
}

module.exports = getPropertyNamesForSchema;
