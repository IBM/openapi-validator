/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaHasConstraint } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * Retrieves the value of "schema"'s attribute named "attrName" either directly from "schema"
 * or from one of its composition "children".
 *
 * This function can be used in scenarios where you need to retrieve a particular schema's
 * field (e.g. the pattern field), but the field might exist either in "schema" itself,
 * or within one or more allOf/anyOf/oneOf list element schemas.
 * @param {*} schema the schema to retrieve the attribute from
 * @param {*} attrName the name of the attribute to retrieve
 * @returns the value of the attribute or undefined if not present
 */
function getCompositeSchemaAttribute(schema, attrName) {
  let value = undefined;
  const foundConstraint = schemaHasConstraint(schema, s => {
    if (attrName in s && s[attrName] !== undefined && s[attrName] !== null) {
      value = s[attrName];
      return true;
    }
  });
  return foundConstraint ? value : undefined;
}

module.exports = getCompositeSchemaAttribute;
