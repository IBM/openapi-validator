const {
  isJsonMimeType,
  isArraySchema,
  isObjectSchema,
  isPrimitiveType
} = require('../utils');

module.exports = {
  inlineResponseSchema,
  inlineRequestSchema
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
 * @param {*} schema a response schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the "location" of the response schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function inlineResponseSchema(schema, options, { path }) {
  // Grab the mimeType for this schema from the path.
  const mimeType = path[path.length - 2];

  // If "schema" is associated with JSON content and is not a primitive type, make sure the schema is a ref.
  if (
    !schema.$ref &&
    isJsonMimeType(mimeType) &&
    !isPrimitiveType(schema) &&
    !arrayItemsAreRefOrPrimitive(schema)
  ) {
    return [
      {
        message:
          'Response schemas should be defined as a $ref to a named schema.',
        path
      }
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
 * @param {*} schema a requestBody schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the "location" of the response schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function inlineRequestSchema(schema, options, { path }) {
  // Grab the mimeType for this schema from the path.
  const mimeType = path[path.length - 2];

  if (!schema.$ref && isJsonMimeType(mimeType)) {
    if (isObjectSchema(schema)) {
      // If "schema" is an inline object schema that will be refactored by the SDK generator, then return a warning.
      //
      // TODO - We need to decide if we want to consider a requestBody schema's "explosiveness" when deciding
      // whether to return a warning or not.
      // Technically, for an inline requestBody schema that will have its body vars exploded we probably don't need
      // to log a warning since we don't actually need the requestBody schema to be a $ref in that case.
      // Currently, this function does not consider this when logging a warning, so any inline object schema
      // found in a requestBody will cause a warning.
      return [
        {
          message:
            'Request body schemas should be defined as a $ref to a named schema.',
          path
        }
      ];
    } else if (
      isArraySchema(schema) &&
      schema.items &&
      isObjectSchema(schema.items)
    ) {
      // If "schema" is an inline array schema, then check its "items" field.
      return [
        {
          message:
            'Request body schemas should be defined as a $ref to a named schema.',
          path: [...path, 'items']
        }
      ];
    }
  }

  return [];
}

/**
 * Returns true if "schema" is an array with an "item" schema
 * that is either a reference or a primitive type.
 * @param {*} schema the schema to check
 * @returns boolean
 */
function arrayItemsAreRefOrPrimitive(schema) {
  return (
    schema &&
    schema.type === 'array' &&
    schema.items &&
    (schema.items.$ref || isPrimitiveType(schema.items))
  );
}
