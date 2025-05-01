/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */
const { isArraySchema } = require('@ibm-cloud/openapi-ruleset-utilities');
const mergeAllOfSchemaProperties = require('./merge-allof-schema-properties');
const { isJsonMimeType } = require('./mimetype-utils');

/**
 * Looks for a query parameter called "offset" and returns the
 * index of the parameter if it is found, -1 if it is not.
 *
 * @param {*} params a list of parameter objects
 * @return integer the index of the searched-for parameter
 */
function getOffsetParamIndex(params) {
  if (!Array.isArray(params)) {
    return -1;
  }

  return params.findIndex(
    param => param.name === 'offset' && param.in === 'query'
  );
}

/**
 * Looks for a query parameter with one of the pre-determined names
 * expected for a page token and returns the index of the
 * parameter if it is found, -1 if it is not.
 *
 * @param {*} params a list of parameter objects
 * @return integer the index of the searched-for parameter
 */
function getPageTokenParamIndex(params) {
  if (!Array.isArray(params)) {
    return -1;
  }

  // The page token-type query param could have any of the names below.
  const pageTokenParamNames = [
    'start',
    'token',
    'cursor',
    'page',
    'page_token',
  ];
  return params.findIndex(
    param =>
      param.in === 'query' && pageTokenParamNames.indexOf(param.name) !== -1
  );
}

/**
 * Looks for a success response on an operation and returns the code if
 * found, null if not.
 *
 * @param {*} operation an operation object
 * @return string the success code, if found, undefined otherwise
 */
function getSuccessCode(operation) {
  if (!operation) {
    return;
  }

  return Object.keys(operation.responses || {}).find(code =>
    code.startsWith('2')
  );
}

/**
 * Looks for a JSON schema in a response and returns the schema
 * if found, null if not.
 *
 * @param {*} response a response object
 * @return object the schema object, if found
 */
function getResponseSchema(response) {
  if (!response) {
    return;
  }

  // Find the json content of the response.
  const content = response.content;
  if (!content) {
    return;
  }

  const jsonMimeType = Object.keys(content).find(mimeType =>
    isJsonMimeType(mimeType)
  );

  if (!jsonMimeType) {
    return;
  }

  const jsonResponse = content[jsonMimeType];

  if (!jsonResponse || !jsonResponse.schema) {
    return;
  }

  // Get the response schema (while potentially taking into account allOf).
  return mergeAllOfSchemaProperties(jsonResponse.schema);
}

/**
 * A function that checks a path for a "get" operation that meets all of the conditions of
 * a "paginated list operation". If it finds one, it returns the operation.
 *
 * An operation is considered to be a paginated "list"-type operation if:
 * 1. The path doesn't end in a path param reference (e.g. /v1/drinks vs /v1/drinks/{drink_id})
 * 2. The operation is a "get"
 * 3. The operation's response schema is an object containing an array property.
 * 4. The operation defines either an "offset" query param or a page token-type query param
 *    whose name is in ['start', 'token', 'cursor', 'page', 'page_token'].
 *
 * @param {*} pathItem the path item that potentially contains a paginated "get" operation.
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @param {*} logInfo an object containing the logger and ruleId of the invoking rule
 * @return object the operation object if found, null if not
 */
function getPaginatedOperationFromPath(pathItem, path, logInfo) {
  // Use the invoking rule's logger, as the value of logging in this utility
  // function exists primarily in the context of the rule.
  const { logger, ruleId } = logInfo;

  // The actual path string (e.g. '/v1/resources') will be the last element in 'path'.
  const pathStr = path[path.length - 1];

  // Retrieve this path item's 'get' operation.
  const operation = pathItem.get;

  // We'll bail out now if any of the following are true:
  // 1. If the path string ends with a path param reference (e.g. '{resource_id}'
  // 2. If the path item doesn't have a 'get' operation.
  if (/}$/.test(pathStr) || !operation) {
    logger.debug(
      `${ruleId}: 'get' operation is absent or excluded at path '${pathStr}'`
    );
    return;
  }

  // Next, find the first success response code.
  const successCode = getSuccessCode(operation);
  if (!successCode) {
    logger.debug(`${ruleId}: No success response code found!`);
    return;
  }

  // Next, find the json content of that response and get the response schema.
  const responseSchema = getResponseSchema(operation.responses[successCode]);

  // If there's no response schema, then we can't check this operation so bail out now.
  if (!responseSchema) {
    logger.debug(`${ruleId}: No response schema found!`);
    return;
  }

  if (!responseSchema.properties) {
    logger.debug(`${ruleId}: Resolved response schema has no properties!`);
    return;
  }

  // Next, make sure there is at least one array property in the response schema.
  if (
    !Object.values(responseSchema.properties).some(prop => isArraySchema(prop))
  ) {
    logger.debug(`${ruleId}: Response schema has no array property!`);
    return;
  }

  // Next, make sure this operation has parameters.
  const params = operation.parameters;
  if (!params) {
    logger.debug(`${ruleId}: Operation has no parameters!`);
    return;
  }

  // Check to see if the operation defines a page token-type query param.
  const pageTokenParamIndex = getPageTokenParamIndex(params);

  // Check to see if the operation defines an "offset" query param.
  const offsetParamIndex = getOffsetParamIndex(params);

  // If the operation doesn't define a page token-type query param or an "offset" query param,
  // then bail out now as pagination isn't supported by this operation.
  if (pageTokenParamIndex < 0 && offsetParamIndex < 0) {
    logger.debug(`${ruleId}: No start or offset query param!`);
    return;
  }

  return operation;
}

module.exports = {
  getOffsetParamIndex,
  getPageTokenParamIndex,
  getSuccessCode,
  getResponseSchema,
  getPaginatedOperationFromPath,
};
