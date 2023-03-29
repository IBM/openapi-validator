/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getSchemaType,
  validateSubschemas,
  SchemaType,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

// We need to look at properties across the entire API definition.
// This will act as a global variable to hold all of the properties
// as we visit elements in the "given" list. This is only initialized
// once, when the ruleset is loaded.
const visitedProperties = {};
let excludedProperties;
let ruleId;
let logger;

module.exports = function (schema, options, context) {
  excludedProperties = options.excludedProperties;

  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(
    schema,
    context.path,
    propertyConsistentNameAndType
  );
};

function propertyConsistentNameAndType(schema, path) {
  if (schema.properties) {
    const errors = [];

    logger.debug(
      `${ruleId}: checking properties in schema at location: ${path.join('.')}`
    );

    for (const [propName, prop] of Object.entries(schema.properties)) {
      // Skip check for deprecated properties.
      if (prop.deprecated === true) {
        logger.debug(
          `${ruleId}: property '${propName}' is deprecated, skipping check.`
        );
        continue;
      }

      const propertyType = getSchemaType(prop).toString();

      if (visitedProperties[propName]) {
        if (visitedProperties[propName].type !== propertyType) {
          logger.debug(
            `${ruleId}: property '${propName}' has type '${propertyType}, but expected '${visitedProperties[propName].type}'!`
          );
          // First property that appeared in API def, should only flag once.
          if (!visitedProperties[propName].flagged) {
            visitedProperties[propName].flagged = true;
            errors.push({
              message: `Properties with the same name have inconsistent types: ${propName}`,
              path: visitedProperties[propName].path,
            });
          }
          // flag the rest of the properties that have the
          // same name but a different type as the first
          errors.push({
            message: `Properties with the same name have inconsistent types: ${propName}`,
            path: [...path, 'properties', propName],
          });
        }
      } else {
        if (propertyType !== SchemaType.UNKNOWN) {
          if (!excludedProperties.includes(propName)) {
            // add property if the name is not excluded
            // and skip properties with an undefined type
            visitedProperties[propName] = {
              type: propertyType,
              path: [...path, 'properties', propName],
              flagged: false,
            };
            logger.debug(
              `${ruleId}: added property '${propName}' (type '${propertyType}') to cache.`
            );
          } else {
            logger.debug(`${ruleId}: property '${propName}' is excluded.`);
          }
        }
      }
    }

    return errors;
  }

  return [];
}
