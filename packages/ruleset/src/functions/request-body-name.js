const { isJsonMimeType, isFormMimeType } = require('../utils');

module.exports = function(operation, _opts, { path }) {
  return requestBodyName(operation, path);
};

// Rudimentary debug logging that is useful in debugging this rule.
const debugEnabled = false;
function debug(msg) {
  if (debugEnabled) {
    console.log(msg);
  }
}

// Name of the extension that we're looking for.
const REQUEST_BODY_NAME = 'x-codegen-request-body-name';

/**
 * This function implements the 'request-body-name' rule.
 * Specifically, it checks to make sure that an operation
 * contains the 'x-codegen-request-body-name' extension if its requestBody
 * "needs" a name.
 * In this context, "needs a name" implies that the operation will have
 * a single body param and the request body is not being "exploded".
 *
 * @param {*} op the operation to check
 * @param {*} path the array of path segments indicating the "location" of "op" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function requestBodyName(op, path) {
  debug(
    '>>> Visiting operation: ' + op.operationId + ' [' + path.join('.') + ']'
  );

  const errors = [];

  // If this operation needs a request body name, then check for one.
  if (
    op &&
    op.requestBody &&
    op.requestBody.content &&
    needRequestBodyName(op.requestBody)
  ) {
    const hasRequestBodyName =
      op[REQUEST_BODY_NAME] && op[REQUEST_BODY_NAME].trim().length;

    if (!hasRequestBodyName) {
      errors.push({
        message:
          'Operations with non-form request bodies should set a name with the x-codegen-request-body-name extension.',
        path
      });
    }
  }

  if (errors.length) {
    debug('>>> Returning errors: ' + JSON.stringify(errors, null, 2));
  } else {
    debug('>>> PASSED!');
  }

  return errors;
}

/**
 * Returns true if and only if "requestBody" should have a request body name specified for it.
 * This will be true IF there is requestBody content and we won't be exploding the body.
 * @param {*} requestBody the operation's requestBody field
 */
function needRequestBodyName(requestBody) {
  const content = requestBody.content;
  const mimeTypes = Object.keys(content);
  if (!mimeTypes.length) {
    return false;
  }

  // Request body has content for at least one mimetype,
  // so let's check if the body will be exploded.

  // Does the operation support JSON content?
  const jsonMimeType = mimeTypes.find(m => isJsonMimeType(m));

  // Does the operation support non-JSON content?
  const hasNonJsonContent = mimeTypes.find(m => !isJsonMimeType(m));

  // Grab the requestBody schema for the JSON mimetype (if present).
  const bodySchema = jsonMimeType && content[jsonMimeType].schema;

  // Is the request body schema an array?
  const isArraySchema = bodySchema && bodySchema.type === 'array';

  // Does the schema contain oneOf/anyOf?
  const isAbstract = isSchemaAbstract(bodySchema);

  // Does the schema support additionalProperties?
  const isDynamic = isSchemaDynamic(bodySchema);

  // Does the schema have a discriminator?
  const hasDiscriminator = bodySchema && bodySchema.discriminator;

  // Does the request body have just a single mimetype?
  const hasSingleMimeType = mimeTypes.length === 1;

  // Determine if the request body will be exploded by the SDK generator.
  const bodyWillBeExploded =
    bodySchema &&
    hasSingleMimeType &&
    !isArraySchema &&
    !hasNonJsonContent &&
    !isAbstract &&
    !isDynamic &&
    !hasDiscriminator;

  const hasFormContent = mimeTypes.find(m => isFormMimeType(m));

  return !bodyWillBeExploded && !hasFormContent;
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
 * Returns true if and only if "schema" contains a oneOf or anyOf list.
 * @param {object} schema the schema to check
 * @returns true if "schema" contains oneOf or anyOf.
 */
function isSchemaAbstract(schema) {
  if (schema && schema.oneOf && schema.oneOf.length) {
    return true;
  }
  if (schema && schema.anyOf && schema.anyOf.length) {
    return true;
  }
  return false;
}
