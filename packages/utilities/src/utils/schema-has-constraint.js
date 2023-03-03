/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const isObject = require('./is-object');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema are
 * required to have a constraint, as checked by a lambda function which checks for the constraint on
 * a simple (non-composite) schema. It does this by recursively checking if:
 *
 * - a schema has the constraint itself, or
 * - one of the schemas it composes with `allOf` has the constraint, or
 * - all of the schemas it composes with `oneOf` have the constraint, or
 * - all of the schemas it composes with `anyOf` have the constraint
 */
const checkCompositeSchemaForConstraint = (schema, hasConstraint) => {
  if (!isObject(schema)) {
    return false;
  }

  if (hasConstraint(schema)) {
    return true;
  }

  const anySchemaHasConstraintReducer = (previousResult, currentSchema) => {
    return (
      previousResult ||
      checkCompositeSchemaForConstraint(currentSchema, hasConstraint)
    );
  };

  const allSchemasHaveConstraintReducer = (previousResult, currentSchema) => {
    return (
      previousResult &&
      checkCompositeSchemaForConstraint(currentSchema, hasConstraint)
    );
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
};

module.exports = checkCompositeSchemaForConstraint;
