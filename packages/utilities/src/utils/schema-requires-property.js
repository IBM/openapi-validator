/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const schemaHasConstraint = require('./schema-has-constraint');
const schemaHasProperty = require('./schema-has-property');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * require a property with the specified name. Note that this method may not behave as expected
 * for OpenAPI documents which contain violations of the `missing-required-property` rule.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {object} name - Name of a property.
 * @returns {boolean}
 */
const schemaRequiresProperty = (schema, name) => {
  return (
    schemaHasConstraint(
      schema,
      s => Array.isArray(s.required) && s.required.includes(name)
    ) && schemaHasProperty(schema, name)
  );
};

module.exports = schemaRequiresProperty;
