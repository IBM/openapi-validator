/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const isObject = require('./is-object');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * enforce a constraint, as checked by a `(schema) => boolean` function which checks for the
 * constraint on a simple (non-composite) schema. It does this by recursively checking if:
 *
 * - a schema has the constraint itself, or
 * - any of the schemas it composes with `allOf` has the constraint, or
 * - all of the schemas it composes with `oneOf` have the constraint, or
 * - all of the schemas it composes with `anyOf` have the constraint
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} hasConstraint a `(schema) => boolean` function to check for a constraint
 * @returns {boolean}
 */
function schemaHasConstraint(schema, hasConstraint) {
  if (!isObject(schema)) {
    return false;
  }

  if (hasConstraint(schema)) {
    return true;
  }

  const anySchemaHasConstraintReducer = (previousResult, currentSchema) => {
    return previousResult || schemaHasConstraint(currentSchema, hasConstraint);
  };

  const allSchemasHaveConstraintReducer = (previousResult, currentSchema) => {
    return previousResult && schemaHasConstraint(currentSchema, hasConstraint);
  };

  // Any allOf schema has the constraint
  if (
    Array.isArray(schema.allOf) &&
    schema.allOf.reduce(anySchemaHasConstraintReducer, false)
  ) {
    return true;
  }

  // All oneOf schemas have the constraint
  if (
    Array.isArray(schema.oneOf) &&
    schema.oneOf.length > 0 &&
    schema.oneOf.reduce(allSchemasHaveConstraintReducer, true)
  ) {
    return true;
  }

  // All anyOf schemas have the constraint
  if (
    Array.isArray(schema.anyOf) &&
    schema.anyOf.length > 0 &&
    schema.anyOf.reduce(allSchemasHaveConstraintReducer, true)
  ) {
    return true;
  }

  return false;
}

module.exports = schemaHasConstraint;
