/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const isObject = require('./is-object');

/**
 * This function is a looser adaptation of the "schemaHasConstraint" function in the utilities package.
 * Here we process oneOf and anyOf lists the same as allOf, where we return true if one (or more)
 * of the oneOf/anyOf elements has the constraint (rather than all of the elements).
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
