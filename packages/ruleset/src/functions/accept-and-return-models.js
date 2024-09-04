/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  isObjectSchema,
  schemaHasConstraint,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { supportsJsonContent, LoggerFactory } = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * ibm-operation-responses - all operations define a response
 * ibm-no-array-responses - response bodies are not arrays
 * ibm-requestbody-is-object - JSON request bodies are object schemas
 * ibm-request-and-response content - request and response bodies define content
 * ibm-well-defined-dictionaries - additional properties aren't mixed with static properties
 *
 */

module.exports = function acceptAndReturnModels(operation, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkForProperties(operation, context.path);
};

/**
 * This function checks to ensure a request or response body schema
 * contains statically defined properties (i.e. is a model and not
 * a dictionary).
 *
 * @param {*} schema - request or response body schema
 * @param {*} path - path to current openapi artifact, as a list
 * @returns an array containing the violations found or [] if no violations
 */
function checkForProperties(schema, path) {
  logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);

  // Content that does not use JSON representation is exempt.
  if (!supportsJsonContent(path.at(-2))) {
    logger.debug(
      `${ruleId}: skipping non-JSON schema at location: ${path.join('.')}`
    );
    return [];
  }

  // Only check schemas that are already defined as an "object" type.
  // Non-object request/response bodies are checked for elsewhere.
  if (!isObjectSchema(schema)) {
    logger.debug(
      `${ruleId}: skipping non-object schema at location: ${path.join('.')}`
    );
    return [];
  }

  if (!schemaHasConstraint(schema, s => schemaDefinesProperties(s))) {
    logger.debug(
      `${ruleId}: No properties found in schema at location: ${path.join('.')}`
    );
    return [
      {
        message:
          'Request and response bodies must be models - their schemas must define `properties`',
        path,
      },
    ];
  }

  logger.debug(`${ruleId}: schema at location: ${path.join('.')} passed!`);
}

function schemaDefinesProperties(s) {
  return (
    s.properties &&
    isObject(s.properties) &&
    Object.entries(s.properties).length > 0
  );
}
