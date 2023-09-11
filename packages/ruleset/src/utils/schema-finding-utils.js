/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const getResponseCodes = require('./get-response-codes');

const {
  isJsonMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
} = require('./mimetype-utils');

/**
 * Takes an operation object/path combo and finds the JSON success
 * response (200) schema, if it exists. We're only interested in
 * JSON content and this is to be used for exclusively GET operations
 * (individual "gets" or "lists") so we only look at 200 status codes.
 *
 * @param {object} operation - an operation object
 * @param {string} pathToOp - the json path leading to the operation
 * (as a dot-separated string)
 * @returns {object} a map containing the schema object (with key
 * 'schemaObject') and path (as a dot-separated string) (with key
 * 'schemaPath').
 */
function getSuccessResponseSchemaForOperation(operation, pathToOp) {
  const info = {};

  if (!operation) {
    return info;
  }

  let pathToSchema = pathToOp;

  if (!operation.responses) {
    return info;
  }

  pathToSchema += '.responses';

  const [, successCodes] = getResponseCodes(operation.responses);

  if (!successCodes || !successCodes.length) {
    return info;
  }

  // Prefer 200 responses if present. If not, find the first response with a JSON schema.
  const code = successCodes.includes('200')
    ? '200'
    : successCodes.find(c => responseHasJsonSchema(operation.responses[c]));
  if (!code) {
    return info;
  }

  const successResponse = operation.responses[code];
  if (!successResponse.content || !isObject(successResponse.content)) {
    return info;
  }

  pathToSchema += `.${code}.content`;

  // Find the first content object determined to be JSON -
  // we are only interested in JSON content.
  const jsonMimeType = Object.keys(successResponse.content).find(mimeType =>
    isJsonMimeType(mimeType)
  );

  if (!jsonMimeType) {
    return info;
  }

  const jsonContent = successResponse.content[jsonMimeType];
  if (!isObject(jsonContent) || !jsonContent.schema) {
    return info;
  }

  info.schemaObject = jsonContent.schema;
  info.schemaPath = pathToSchema + `.${jsonMimeType}.schema`;

  return info;
}

function responseHasJsonSchema(response) {
  return (
    response.content &&
    Object.keys(response.content).some(
      c => isJsonMimeType(c) && response.content[c].schema
    )
  );
}

/**
 * Takes an operation object/path combo and finds the JSON request body
 * schema, if it exists. We're only interested in JSON content.
 *
 * @param {object} operation - an operation object
 * @param {string} pathToOp - the json path leading to the operation
 * (as a dot-separated string)
 * @returns {object} a map containing the schema object (with key
 * 'schemaObject') and path (as a dot-separated string) (with key
 * 'schemaPath').
 */
function getRequestBodySchemaForOperation(operation, pathToOp) {
  const info = {};

  if (!operation) {
    return info;
  }

  let pathToSchema = pathToOp;

  if (!operation.requestBody) {
    return info;
  }

  const body = operation.requestBody;
  pathToSchema += '.requestBody';

  if (!body.content || !isObject(body.content)) {
    return info;
  }

  pathToSchema += '.content';

  // Find the first content object determined to be JSON -
  // we are only interested in JSON content.
  const isPatch = pathToOp.split('.').at(-1).toLowerCase() === 'patch';
  const mimeType = Object.keys(body.content).find(mimeType =>
    isPatch
      ? isJsonPatchMimeType(mimeType) || isMergePatchMimeType(mimeType)
      : isJsonMimeType(mimeType)
  );
  if (!mimeType) {
    return info;
  }

  const jsonContent = body.content[mimeType];
  if (!isObject(jsonContent) || !jsonContent.schema) {
    return info;
  }

  info.schemaObject = jsonContent.schema;
  info.schemaPath = pathToSchema + `.${mimeType}.schema`;

  return info;
}

module.exports = {
  getSuccessResponseSchemaForOperation,
  getRequestBodySchemaForOperation,
};
