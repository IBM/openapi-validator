/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isArraySchema,
  isPrimitiveSchema,
  validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  isJsonMimeType,
  isEmptyObjectSchema,
  isRefSiblingSchema,
} = require('../utils');

/**
 * Checks to make sure that nested object schemas are defined using a $ref rather than
 * an inline object schema.
 * When the SDK generator encounters a nested schema (property, additionalProperties, array items, etc.)
 * that is defined as an inline object schema, it must refacter the inline object schema by moving it to
 * the "components.schemas" section and replacing it with a $ref.
 * This is done so that the schema property will have an appropriate datatype that defines
 * the nested object.   When the generator refactors a schema, it computes a name for the new schema by
 * combining the name of the containing schema (the schema that contains the nested schema) together
 * with the name of the property (e.g. property "foo" within schema MyModel would yield a new schema name
 * of "MyModelFoo", the "items" field within array schema MyList would yield a new schema name of
 * "MyListItems", etc.).
 * To avoid these sub-optimal name computations, the recommendation is to define each
 * nested object schema property to use a schema reference to avoid the refactoring performed by the generator.
 * @param {*} schema a schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
module.exports = function (schema, options, { path }) {
  return validateSubschemas(schema, path, checkForInlineObjectSchemas);
};

/**
 * Checks the specified schema to determine if it's an inline object schema.
 * If yes and it is in a "reportable" location, then return a warning for it.
 *
 * @param {*} schema the schema to be checked
 * @param {*} path the array of path segments indicating the "location" of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForInlineObjectSchemas(schema, path) {
  // If "schema" is a $ref or fits the ref-sibling pattern,
  // then bail out now to avoid a warning.
  if (schema.$ref || isPrimitiveSchema(schema) || isRefSiblingSchema(schema)) {
    return [];
  }

  // We need to avoid returning a warning for certain locations within the API,
  // because those are locations where it's ok to have an inline object schema.
  const pathString = path.join('!');

  // It's ok for a named schema to be an inline object schema (duh!).
  if (/^components!schemas![^!]+$/.test(pathString)) {
    return [];
  }

  // We don't want to return a warning for an individual element of an
  // allOf composition because an individual list element
  // doesn't provide the full context of the inline object schema.
  // Any violations would be reported against the schema that contains the allOf.
  if (/allOf![^!]+$/.test(pathString)) {
    return [];
  }

  // At this point, we have an inline schema.
  // We'll do some additional checks according to the type of schema,
  // and potentially return a warning.

  // Request body schema.
  if (
    /requestBody!content![^!]+!schema$/.test(pathString) ||
    /components!requestBodies![^!]+!content![^!]+!schema$/.test(pathString)
  ) {
    const mimetype = path[path.length - 2];
    if (!isJsonMimeType(mimetype) || isArraySchema(schema)) {
      return [];
    }

    return [
      {
        message:
          'Request body schemas should be defined as a $ref to a named schema',
        path,
      },
    ];
  } else if (/responses![^!]+!content![^!]+!schema$/.test(pathString)) {
    // Response schema.
    const mimetype = path[path.length - 2];
    if (!isJsonMimeType(mimetype) || isArraySchema(schema)) {
      return [];
    }
    return [
      {
        message:
          'Response schemas should be defined as a $ref to a named schema',
        path,
      },
    ];
  } else {
    // Must be a property schema.
    if (!isEmptyObjectSchema(schema) && !isArraySchema(schema)) {
      return [
        {
          message:
            'Nested objects should be defined as a $ref to a named schema',
          path,
        },
      ];
    }
  }

  return [];
}
