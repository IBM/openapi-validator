const { isJsonMimeType, isPrimitiveType } = require('../utils');

module.exports = function(response, options, { path }) {
  return inlineResponseSchema(response, path);
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
 * @param {*} responseSchema a response schema from the unresolved API definition
 * @param {*} path the array of path segments indicating the "location" of the response schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function inlineResponseSchema(responseSchema, path) {
  // Grab the mimeType for this schema from the path.
  const mimeType = path[path.length - 2];

  // If "schema" is associated with JSON content and is not a primitive type, make sure the schema is a ref.
  if (
    isJsonMimeType(mimeType) &&
    !responseSchema.$ref &&
    !isPrimitiveType(responseSchema) &&
    !arrayItemsAreRefOrPrimitive(responseSchema)
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
