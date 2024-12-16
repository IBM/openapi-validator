/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateSubschemas,
  schemaHasConstraint,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory, isPrimarySchema } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, schemaDescriptionExists);
};

function schemaDescriptionExists(schema, path) {
  // Check to see if "path" represents a primary schema (i.e. not a schema property).
  // If "schema" is a primary schema, then check for a description.
  if (isPrimarySchema(path)) {
    logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);

    if (!schemaHasDescription(schema)) {
      logger.debug(`${ruleId}: no description found!`);
      return [
        {
          message: 'Schemas should have a non-empty description',
          path,
        },
      ];
    }
  }

  return [];
}

// This function will return true if one of the following is true:
// 1. 'schema' has a non-empty description.
// 2. 'schema' has an allOf list and AT LEAST ONE list element schema has a non-empty description.
// 3. 'schema' has a oneOf or anyOf list and ALL of the list element schemas
//    have a non-empty description.
function schemaHasDescription(schema) {
  return schemaHasConstraint(
    schema,
    s => s && s.description && s.description.toString().trim().length
  );
}
