const { isArraySchema } = require('@ibm-cloud/openapi-ruleset-utilities');
const { supportsJsonContent } = require('./mimetype-utils');

/**
 * Returns true iff the specified requestBody defines JSON content that will be exploded by
 * the SDK generator.
 * @param {*} requestBody the operation requestBody to be checked
 * @returns true if the requestBody will be exploded by the generator, false otherwise
 */
function isRequestBodyExploded(requestBody) {
  if (!requestBody) {
    return false;
  }

  const content = requestBody.content;
  if (!content) {
    return false;
  }

  const mimeTypes = Object.keys(content);
  if (!mimeTypes.length) {
    return false;
  }

  // Request body has content for at least one mimetype,
  // so let's check if the body will be exploded.

  // Does the operation support JSON content?
  const jsonMimeType = mimeTypes.find(m => supportsJsonContent(m));

  // Does the operation support non-JSON content?
  const hasNonJsonContent = mimeTypes.find(m => !supportsJsonContent(m));

  // Grab the requestBody schema for the JSON mimetype (if present).
  const bodySchema = jsonMimeType ? content[jsonMimeType].schema : null;
  if (!bodySchema) {
    return false;
  }

  // Is the schema an array?
  const isArrayBody = isArraySchema(bodySchema);

  // Does the schema contain oneOf/anyOf?
  const isAbstract = isSchemaAbstract(bodySchema);

  // Does the schema support additionalProperties?
  const isDynamic = isSchemaDynamic(bodySchema);

  // Does the schema have a discriminator?
  const hasDiscriminator = !!bodySchema.discriminator;

  // Does the request body have just a single mimetype?
  const hasSingleMimeType = mimeTypes.length === 1;

  // Determine if the request body will be exploded by the SDK generator.
  const bodyWillBeExploded =
    hasSingleMimeType &&
    !isArrayBody &&
    !hasNonJsonContent &&
    !isAbstract &&
    !isDynamic &&
    !hasDiscriminator;

  return bodyWillBeExploded;
}

/**
 * Returns true if and only if "schema" supports additional properties.
 * @param {*} schema the schema to check
 * @returns true if "schema" supports additional properties.
 */
function isSchemaDynamic(schema) {
  const hasAdditionalProperties = schema && schema.additionalProperties;
  return hasAdditionalProperties;
}

/**
 * Returns true if and only if "schema" contains a non-empty oneOf or anyOf list.
 * @param {object} schema the schema to check
 * @returns true if "schema" contains oneOf or anyOf.
 */
function isSchemaAbstract(schema) {
  if (schema && Array.isArray(schema.oneOf) && schema.oneOf.length) {
    return true;
  }
  if (schema && Array.isArray(schema.anyOf) && schema.anyOf.length) {
    return true;
  }
  return false;
}

module.exports = isRequestBodyExploded;
