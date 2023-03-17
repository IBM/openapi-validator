/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaHasConstraint } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return mergePatchOptionalProperties(schema, context.path);
};

/**
 * This function is invoked for each merge-patch operation's requestBody schema and
 * will check to make sure the schema doesn't define any required properties.
 *
 * @param {} schema the requestBody schema to check for required properties
 * @param {*} path the array of path segments indicating the "location" of a
 * requestBody schema for a merge-patch operation (e.g. ['paths', '/v1/things/{thing_id}',
 * 'patch', 'requestBody', 'content', 'application/merge-patch+json', 'schema'])).
 * @returns an array containing the violations found or [] if no violations
 */
function mergePatchOptionalProperties(schema, path) {
  logger.debug(
    `${ruleId}: checking merge-patch schema properties at location: ${path.join(
      '.'
    )}`
  );
  if (containsRequiredProperties(schema) || hasMinProperties(schema)) {
    logger.debug(`${ruleId}: detected required properties!`);
    return [
      {
        // The rule's description field is used as the error message.
        message: '',
        path,
      },
    ];
  }

  return [];
}

function containsRequiredProperties(schema) {
  return schemaHasConstraint(
    schema,
    s => s && Array.isArray(s.required) && s.required.length > 0
  );
}

function hasMinProperties(schema) {
  return schemaHasConstraint(schema, s => s && s.minProperties);
}
