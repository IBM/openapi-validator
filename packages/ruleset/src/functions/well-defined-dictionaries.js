/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  isObjectSchema,
  schemaHasConstraint,
  schemaLooselyHasConstraint,
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

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
  if (path.at(-1) === 'additionalProperties') {
    return [];
  }

  logger.debug(
    `${ruleId}: checking object schema at location: ${path.join('.')}`
  );

  // Dictionaries should have additionalProperties defined on them.
  // If the schema doesn't, make sure it has properties and then
  // abandon the check.
  if (!schemaDefinesField(schema, 'additionalProperties')) {
    if (!schemaDefinesField(schema, 'properties')) {
      return [
        {
          message:
            'Object schemas must define either properties, or additionalProperties with a concrete type',
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
      message:
        'Dictionary schemas must have a single, well-defined value type in `additionalProperties`',
      path,
    });
  }

  // The Handbook guidelines state that dictionary types
  // should not be dictionaries themselves.
  if (schemaHasConstraint(schema, isDictionaryOfDictionaries)) {
    errors.push({
      message: 'Dictionaries must not have values that are also dictionaries.',
      path,
    });
  }

  return errors;
}

function schemaDefinesField(schema, field) {
  return schemaHasConstraint(schema, s => !!s[field]);
}

function isAmbiguousDictionary(schema) {
  if (!schema.additionalProperties) {
    return false;
  }

  // additionalProperties must be an object (not a boolean) value
  // and must define a `type` field in order to be considered an
  // unambiguous dictionary.
  return (
    !isObject(schema.additionalProperties) ||
    !schemaDefinesField(schema.additionalProperties, 'type')
  );
}

function isDictionaryOfDictionaries(schema) {
  if (!isObject(schema.additionalProperties)) {
    return false;
  }

  // We don't want any schema that may define the dictionary values
  // to also be a dictionary, so we use a looser constraint that
  // checks against any oneOf/anyOf schema.
  return schemaLooselyHasConstraint(
    schema.additionalProperties,
    s => !!s['additionalProperties']
  );
}
