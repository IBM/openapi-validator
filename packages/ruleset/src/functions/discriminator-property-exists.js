/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Assertation 1:
// if discriminator exist inside schema object, it must be of type Object
// enforced by Spectral's oas3-schema rule

// Assertion 2:
// discriminator object must have a field name propertyName
// enforced by Spectral's oas3-schema rule

// Assertation 3:
// propertyName is of type string
// enforced by Spectral's oas3-schema rule

// Assertation 4:
// The discriminator property (whose name is specified by the discriminator.propertyName field)
// must be defined in the schema.

const {
  schemaHasProperty,
  validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, validateDiscriminators);
};

function validateDiscriminators(schema, path) {
  const { discriminator } = schema;
  if (!discriminator || !typeof discriminator === 'object') {
    return [];
  }

  logger.debug(
    `${ruleId}: checking discriminator at location: ${path.join('.')}`
  );

  const errors = [];

  const { propertyName } = discriminator;
  if (!schemaHasProperty(schema, propertyName)) {
    logger.debug(`Discriminator property is not defined: ${propertyName}`);
    errors.push({
      message: `Discriminator property must be defined in the schema: ${propertyName}`,
      path: [...path, 'discriminator', 'propertyName'],
    });
  }

  return errors;
}
