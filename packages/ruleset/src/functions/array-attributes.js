/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isPlainObject } = require('lodash');
const {
  validateNestedSchemas,
  isArraySchema,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { getCompositeSchemaAttribute, LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateNestedSchemas(
    schema,
    context.path,
    arrayAttributeErrors,
    true,
    false
  );
};

function arrayAttributeErrors(schema, path) {
  logger.debug(
    `${ruleId}: checking attributes of schema at location: ${path.join('.')}`
  );

  const errors = [];

  if (isArraySchema(schema)) {
    // Is minItems defined?
    const minItems = getCompositeSchemaAttribute(schema, 'minItems');
    if (!isDefined(minItems)) {
      logger.debug('minItems field is missing!');
      errors.push({
        message: `Array schemas should define a numeric 'minItems' field`,
        path,
      });
    }

    // Is maxItems defined?
    const maxItems = getCompositeSchemaAttribute(schema, 'maxItems');
    if (!isDefined(maxItems)) {
      logger.debug('maxItems field is missing!');
      errors.push({
        message: `Array schemas should define a numeric 'maxItems' field`,
        path,
      });
    }

    // Is minItems <= maxItems?
    if (isDefined(minItems) && isDefined(maxItems) && minItems > maxItems) {
      logger.debug('minItems > maxItems!');
      errors.push({
        message: `'minItems' cannot be greater than 'maxItems'`,
        path,
      });
    }

    // Is enum defined? Shouldn't be
    const enm = getCompositeSchemaAttribute(schema, 'enum');
    if (isDefined(enm)) {
      logger.debug('enum field is present!');
      errors.push({
        message: `Array schemas should not define an 'enum' field`,
        path: [...path, 'enum'],
      });
    }

    // Is items defined?
    const items = getCompositeSchemaAttribute(schema, 'items');
    if (!isDefined(items) || !isPlainObject(items)) {
      logger.debug('items field is missing or is not an object!');
      return [
        {
          message: `Array schemas must specify the 'items' field`,
          path,
        },
      ];
    }
  } else {
    // minItems/maxItems/items should not be defined for a non-array schema
    if (schema.minItems) {
      errors.push({
        message: `'minItems' should not be defined for a non-array schema`,
        path: [...path, 'minItems'],
      });
    }
    if (schema.maxItems) {
      errors.push({
        message: `'maxItems' should not be defined for a non-array schema`,
        path: [...path, 'maxItems'],
      });
    }
    if (schema.items) {
      errors.push({
        message: `'items' should not be defined for a non-array schema`,
        path: [...path, 'items'],
      });
    }
  }

  return errors;
}

function isDefined(x) {
  return x !== null && x !== undefined;
}
