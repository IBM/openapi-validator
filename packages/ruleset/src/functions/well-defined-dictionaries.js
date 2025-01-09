/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  isObjectSchema,
  schemaHasConstraint,
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - ibm-pattern-properties: patternProperties isn't empty or the wrong type
 */

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateNestedSchemas(schema, context.path, wellDefinedDictionaries);
};

function wellDefinedDictionaries(schema, path) {
  // We only care about object schemas.
  if (!isObject(schema) || !isObjectSchema(schema)) {
    return [];
  }

  // We will flag dictionaries of dictionaries, so we can skip
  // providing guidance for directly nested dictionaries.
  if (isDictionaryValueSchema(path)) {
    return [];
  }

  logger.debug(
    `${ruleId}: checking object schema at location: ${path.join('.')}`
  );

  // Dictionaries should have additionalProperties or patternProperties
  // defined on them. If the schema doesn't, make sure it has properties
  // and then abandon the check.
  if (!isDictionarySchema(schema)) {
    if (!schemaDefinesField(schema, 'properties')) {
      return [
        {
          message:
            'Object schemas must define either properties, or (additional/pattern)Properties with a concrete type',
          path,
        },
      ];
    }

    logger.debug(
      `${ruleId}: object schema at location ${path.join(
        '.'
      )} is a model, no need to check`
    );

    return [];
  }

  const errors = [];

  // An object cannot try to be a model and a dictionary at the same time.
  // It can't have both properties and additionalProperties.
  if (schemaDefinesField(schema, 'properties')) {
    errors.push({
      message:
        'Object schemas must be either a model or a dictionary - they cannot be both',
      path,
    });
  }

  // Make sure the dictionary has a defined type. We may want to make this check
  // more strict in the future but this meets our current purposes.
  if (schemaHasConstraint(schema, isAmbiguousDictionary)) {
    errors.push({
      message: 'Dictionary schemas must have a single, well-defined value type',
      path,
    });
  }

  // The Handbook guidelines state that dictionary types
  // should not be dictionaries themselves.
  if (schemaHasConstraint(schema, isDictionaryOfDictionaries)) {
    errors.push({
      message: 'Dictionaries must not have values that are also dictionaries',
      path,
    });
  }

  return errors;
}

function schemaDefinesField(schema, field) {
  return schemaHasConstraint(schema, s => !!s[field]);
}

function isAmbiguousDictionary(schema) {
  return dictionaryValuesHaveConstraint(
    schema,
    valueSchema =>
      !isObject(valueSchema) || !schemaDefinesField(valueSchema, 'type')
  );
}

function isDictionaryOfDictionaries(schema) {
  return dictionaryValuesHaveConstraint(
    schema,
    valueSchema => isObject(valueSchema) && isDictionarySchema(valueSchema)
  );
}

function dictionaryValuesHaveConstraint(schema, hasConstraint) {
  return schemaHasConstraint(schema, s => {
    if (s.additionalProperties !== undefined) {
      return hasConstraint(s.additionalProperties);
    }

    if (s.patternProperties !== undefined) {
      return Object.values(s.patternProperties).some(p => hasConstraint(p));
    }

    return false;
  });
}

// Check, *by path*, if the current schema is a dictionary value schema.
function isDictionaryValueSchema(path) {
  return (
    path.at(-1) === 'additionalProperties' ||
    path.at(-2) === 'patternProperties'
  );
}

// Check, *by object fields* if the current schema is a dictionary or not.
function isDictionarySchema(schema) {
  return (
    schemaDefinesField(schema, 'additionalProperties') ||
    schemaDefinesField(schema, 'patternProperties')
  );
}
