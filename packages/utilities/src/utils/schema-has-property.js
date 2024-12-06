/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const schemaHasConstraint = require('./schema-has-constraint');
/**
 * @private
 */
const isObject = require('./is-object');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * define a property with the specified name.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {string} propertyName name of the object schema property to check for
 * @returns {boolean}
 */
function schemaHasProperty(schema, propertyName) {
  return schemaHasConstraint(
    schema,
    s => 'properties' in s && isObject(s.properties[propertyName])
  );
}

module.exports = schemaHasProperty;
