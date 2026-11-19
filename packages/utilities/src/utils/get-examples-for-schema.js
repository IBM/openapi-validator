/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
import collectFromComposedSchemas from './collect-from-composed-schemas.js';

/**
 * Returns an array of examples for a simple or composite schema. For each composed schema, if
 * `schema.examples` is present (and an array), `schema.example` is ignored.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {Array} examples
 */
function getExamplesForSchema(schema) {
  return collectFromComposedSchemas(schema, s => {
    if (Array.isArray(s.examples)) {
      return s.examples;
    } else if (s.example !== undefined) {
      return [s.example];
    }

    return [];
  });
}

export default getExamplesForSchema;
