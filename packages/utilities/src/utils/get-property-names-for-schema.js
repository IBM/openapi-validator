/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const isObject = require('./is-object');

/**
 * Returns an array of property names for a simple or composite schema,
 * optionally filtered by a lambda function.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object
 * @param {function} propertyFilter - A lambda function to perform filtering
 * @returns {array} - Array of property names
 */
const getPropertyNamesForSchema = (schema, propertyFilter = () => true) => {
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
};

module.exports = getPropertyNamesForSchema;
