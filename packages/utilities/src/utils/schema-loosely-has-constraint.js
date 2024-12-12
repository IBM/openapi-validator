/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const isObject = require('./is-object');

/**
 * This function is a looser adaptation of the `schemaHasConstraint()` function.
 * Here, we process `oneOf` and `anyOf` lists the same as `allOf`, returning `true` if:
 *
 * - a schema has the constraint itself, or
 * - any of the schemas it composes with `allOf` has the constraint, or
 * - any of the schemas it composes with `oneOf` has the constraint, or
 * - any of the schemas it composes with `anyOf` has the constraint
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} hasConstraint a `(schema) => boolean` function to check for a constraint
 * @returns {boolean}
 */
function schemaLooselyHasConstraint(schema, hasConstraint) {
  if (!isObject(schema)) {
    return false;
  }

  if (hasConstraint(schema)) {
    return true;
  }

  const anySchemaHasConstraintReducer = (previousResult, currentSchema) => {
    return (
      previousResult || schemaLooselyHasConstraint(currentSchema, hasConstraint)
    );
  };

  for (const applicator of ['allOf', 'oneOf', 'anyOf']) {
    if (
      Array.isArray(schema[applicator]) &&
      schema[applicator].length > 0 &&
      schema[applicator].reduce(anySchemaHasConstraintReducer, false)
    ) {
      return true;
    }
  }

  return false;
}

module.exports = schemaLooselyHasConstraint;
