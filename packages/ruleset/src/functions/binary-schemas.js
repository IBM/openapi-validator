/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isBinarySchema } = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  isJsonMimeType,
  isParamSchema,
  isParamContentSchema,
  isRequestBodySchema,
  isResponseSchema,
  LoggerFactory,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return binarySchemaCheck(schema, context.path);
};

/**
 * This function implements the 'binary-schemas' rule which makes sure that
 * binary schemas are used only in the proper places within the API definition.
 * Specifically this rule performs the following checks:
 * 1. Parameters should not contain binary values (type: string, format: binary).
 * 2. JSON request bodies should not contain binary values (type: string, format: binary).
 * 3. JSON response bodies should not contain binary values (type: string, format: binary).
 *
 * @param {*} schema the schema to be checked (it may or may not be a binary schema)
 * @param {*} path the array of path segments indicating the "location" of the schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function binarySchemaCheck(schema, path) {
  // If "schema" is not binary, then we're done!
  if (!isBinarySchema(schema) && !isBinarySchema(schema.items)) {
    return [];
  }

  logger.debug(
    `${ruleId}: checking binary schema at location: ' + path.join('.')`
  );

  // We know that "schema" is binary, so let's do some checks on "path"
  // to see if it is being used where it shouldn't be.

  // 1. Is it the schema for a parameter within a path item or operation?
  // a. ...parameters[n].schema
  // b. ...parameters[n].content.*.schema
  if (
    isParamSchema(path) ||
    (isParamContentSchema(path) && isJsonMimeType(path[path.length - 2]))
  ) {
    logger.debug(`${ruleId}: it's a parameter schema!`);
    return [
      {
        message:
          'Parameters should not contain binary values (type: string, format: binary)',
        path,
      },
    ];
  }

  // 2. Is it the schema for a JSON requestBody?
  if (isRequestBodySchema(path) && isJsonMimeType(path[path.length - 2])) {
    logger.debug(`${ruleId}: it's a requestBody schema!`);
    return [
      {
        message:
          'Request bodies with JSON content should not contain binary values (type: string, format: binary)',
        path,
      },
    ];
  }

  // 3. Is it the schema for a JSON response?
  if (isResponseSchema(path) && isJsonMimeType(path[path.length - 2])) {
    logger.debug(`${ruleId}: it's a response schema!`);
    return [
      {
        message:
          'Responses with JSON content should not contain binary values (type: string, format: binary)',
        path,
      },
    ];
  }

  return [];
}
