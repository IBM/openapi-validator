/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const schemaHasConstraint = require('./schema-has-constraint');
const isObject = require('./is-object');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * define a property with the specified name.
 */
const schemaHasProperty = (schema, name) => {
  return schemaHasConstraint(
    schema,
    s => 'properties' in s && isObject(s.properties[name])
  );
};

module.exports = schemaHasProperty;
