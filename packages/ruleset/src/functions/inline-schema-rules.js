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
  getCompositeSchemaAttribute,
  isJsonMimeType,
  isEmptyObjectSchema,
  isRefSiblingSchema,
} = require('../utils');

module.exports = {
  inlinePropertySchema,
  inlineResponseSchema,
  inlineRequestSchema,
};

/**
 * Checks to make sure that response objects use schema references rather than inline schemas.
 * Defining each response so that it references a named schema offers benefits for SDK generation
 * because the generator will use the name of the referenced schema as the operation's return type.
 * While the SDK generator will in fact refactor any inline response schemas (move them to
 * "components.schemas" and replace them with a reference), the schema name computed by the generator
 * is not optimal (e.g. "CreateThingResponse").
 * Therefore, the recommendation is to define each response to use a schema reference to
 * avoid the refactoring performed by the generator.
 * @param {*} schema a schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function inlineResponseSchema(schema, options, { path }) {
  // Grab the mimeType for this schema from the path.
  const mimeType = path[path.length - 2];

  // If "schema" is associated with JSON content and is not a primitive type, make sure the schema is a ref.
  if (
    !schema.$ref &&
    isJsonMimeType(mimeType) &&
    !isPrimitiveSchema(schema) &&
    !arrayItemsAreRefOrPrimitive(schema) &&
    !isRefSiblingSchema(schema)
  ) {
    return [
      {
        message:
          'Response schemas should be defined as a $ref to a named schema.',
        path,
      },
    ];
  }

  return [];
}

/**
 * Checks to make sure that requestBody objects use schema references rather than inline schemas.
 * Defining each requestBody so that it references a named schema offers benefits for SDK generation
 * because the generator will use the name of the referenced schema as the datatype for
 * the operation's body parameter.
 * While the SDK generator will in fact refactor any inline requestBody schemas (move them to
 * "components.schemas" and replace them with a reference), the schema name computed by the generator
 * is not optimal (e.g. "CreateThingRequest").
 * Therefore, the recommendation is to define each requestBody object to use a schema reference to
 * avoid the refactoring performed by the generator.
 * @param {*} schema a schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function inlineRequestSchema(schema, options, { path }) {
  // Grab the mimeType for this schema from the path.
  const mimeType = path[path.length - 2];

  if (
    !schema.$ref &&
    isJsonMimeType(mimeType) &&
    !isPrimitiveSchema(schema) &&
    !arrayItemsAreRefOrPrimitive(schema) &&
    !isRefSiblingSchema(schema)
  ) {
    const errPath = [...path];
    if (isArraySchema(schema)) {
      errPath.push('items');
    }
    return [
      {
        message:
          'Request body schemas should be defined as a $ref to a named schema.',
        path: errPath,
      },
    ];
  }

  return [];
}

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
function inlinePropertySchema(schema, options, { path }) {
  // If "schema" is not a primitive, then check each sub-schema that is reachable from
  // "schema" (properties, additionalProperties, allOf/anyOf/oneOf, array items, etc.).
  return isPrimitiveSchema(schema)
    ? []
    : validateSubschemas(schema, path, checkForInlineNestedObjectSchema);
}

/**
 * Checks the specified schema to determine if it's an inline object schema.
 * If yes and it is in a "reportable" location, then return a warning for it.
 *
 * @param {*} schema the schema to be checked
 * @param {*} path the array of path segments indicating the "location" of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForInlineNestedObjectSchema(schema, path) {
  // If "schema" is a $ref or fits the ref-sibling pattern,
  // then bail out now to avoid a warning.
  if (
    schema.$ref ||
    isPrimitiveSchema(schema) ||
    isRefSiblingSchema(schema) ||
    isEmptyObjectSchema(schema) ||
    isArraySchema(schema)
  ) {
    return [];
  }

  // We need to avoid returning a warning for certain locations within the API because those are
  // either covered by other rules or are otherwise locations where it's ok to have an inline object schema.
  const pathString = path.join('!');

  // It's ok for a named schema to be an inline object schema (duh!).
  if (/^components!schemas![^!]+$/.test(pathString)) {
    return [];
  }

  // Request body schemas are handled by the inline-request-schema rule.
  if (/requestBody!content![^!]+!schema$/.test(pathString)) {
    return [];
  }

  // Response schemas are handled by the inline-response-schema rule.
  if (/responses![^!]+!content![^!]+!schema$/.test(pathString)) {
    return [];
  }

  // We don't want to return a warning for an individual element of an
  // allOf composition because an individual list element
  // doesn't provide the full context of the inline object schema.
  // Any violations would be reported against the schema that contains the allOf.
  if (/allOf![^!]+$/.test(pathString)) {
    return [];
  }

  // If we made it here, then "path" must be a "reportable" location.
  return [
    {
      message: 'Nested objects should be defined as a $ref to a named schema.',
      path,
    },
  ];
}

/**
 * Returns true if "schema" is an array with an "item" schema
 * that is either a reference or a primitive type.
 * @param {*} schema the schema to check
 * @returns boolean
 */
function arrayItemsAreRefOrPrimitive(schema) {
  const isArray = isArraySchema(schema);
  const items = isArray && getCompositeSchemaAttribute(schema, 'items');
  return items && (items.$ref || isPrimitiveSchema(items));
}
