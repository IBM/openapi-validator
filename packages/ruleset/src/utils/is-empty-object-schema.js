/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Returns true iff "schema" is an empty object schema.
 * Examples of an empty object schema include:
 *   components:
 *     schemas:
 *       AnyObject:
 *         description: 'Map of string to anything'
 *         type: object
 *         additionalProperties: true
 *       EmptyObject:
 *         description: 'Also rendered as a map of string to anything'
 *         type: object
 * The 'description' and 'additionalProperties' fields are optional.
 *
 * @param {} schema the schema to check
 * @return boolean true if "schema" is an empty object schema, false otherwise
 */
function isEmptyObjectSchema(schema) {
  // The type field is required and must be "object".
  if (!schema || schema.type !== 'object') {
    return false;
  }

  // If additionalProperties is present but explicitly set to false,
  // this isn't an empty object schema.
  if (
    'additionalProperties' in schema &&
    schema.additionalProperties === false
  ) {
    return false;
  }

  // "schema" should have only the following properties (ignoring annotations).
  // 'description' and 'additionalProperties' are optional.
  const allowableFields = ['type', 'description', 'additionalProperties'];
  for (const field of Object.keys(schema)) {
    if (!allowableFields.includes(field) && !field.startsWith('x-')) {
      return false;
    }
  }

  return true;
}

module.exports = isEmptyObjectSchema;
