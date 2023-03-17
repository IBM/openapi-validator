/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, propertyNameCollision);
};

const errorMsg =
  'Avoid duplicate property names within a schema, even if different case conventions are used';

function propertyNameCollision(schema, path) {
  if (!schema.properties) {
    return [];
  }

  const errors = [];

  const prevProps = [];

  for (const [propName, prop] of Object.entries(schema.properties)) {
    // Skip check for deprecated properties.
    if (prop.deprecated === true) continue;

    const caselessPropName = propName.replace(/[_-]/g, '').toLowerCase();
    if (prevProps.includes(caselessPropName)) {
      logger.debug(
        `${ruleId}: found duplicate property '${propName}' in schema at location: ${path.join(
          '.'
        )}!`
      );
      errors.push({
        message: errorMsg,
        path: [...path, 'properties', propName],
      });
    } else {
      prevProps.push(caselessPropName);
    }
  }

  return errors;
}
