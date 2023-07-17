/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

// Valid schema types.
const validTypes = [
  'array',
  'boolean',
  'integer',
  'number',
  'object',
  'string',
];

// Valid format values for selected schema types.
const validIntegerFormats = ['int32', 'int64'];
const validNumberFormats = ['float', 'double'];
const validStringFormats = [
  'binary',
  'byte',
  'crn',
  'date',
  'date-time',
  'email',
  'identifier',
  'password',
  'url',
  'uuid',
];

// Pre-define some error messages that we can re-use later.
const formatButNoTypeErrorMsg = 'Format defined without a type';
const formatWithMultipleTypesErrorMsg =
  'Format defined with multiple types is ambiguous';
const invalidTypeErrorMsg = `Invalid type; valid types are: ${validTypes.join(
  ', '
)}`;
const integerFormatErrorMsg = `Schema of type integer should use one of the following formats: ${validIntegerFormats.join(
  ', '
)}`;
const numberFormatErrorMsg = `Schema of type number should use one of the following formats: ${validNumberFormats.join(
  ', '
)}`;
const stringFormatErrorMsg = `Schema of type string should use one of the following formats: ${validStringFormats.join(
  ', '
)}`;

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, typeFormatErrors);
};

function typeFormatErrors(schema, path) {
  logger.debug(
    `${ruleId}: checking schema [type=${schema.type}, format=${
      schema.format
    }] at location: ${path.join('.')}`
  );

  // Determine the schema's type.  This could be either
  // a string or a list of strings.  If "type" is a list,
  // we'll expect it to contain only a single non-null type
  // if "format" is also specified.
  const format = schema.format ? schema.format.trim().toLowerCase() : undefined;
  let type;
  if (typeof schema.type === 'string') {
    type = schema.type.trim().toLowerCase();
  } else if (Array.isArray(schema.type)) {
    // Not interested in any 'null' type values.
    const filteredTypes = schema.type.filter(t => t !== 'null');
    if (filteredTypes.length === 1) {
      // If we have a single entry in type array, let's use it.
      type = filteredTypes[0].trim().toLowerCase();
    } else if (filteredTypes.length > 1) {
      // If multiple types are defined along with format, that's an error.
      if (format) {
        logger.debug(
          `${ruleId}: error: found multiple types along with format.\n`
        );
        return [
          {
            message: formatWithMultipleTypesErrorMsg,
            path,
          },
        ];
      }
    }
  }

  // If "type" isn't specified but format IS specified, that's an error.
  if (!type) {
    if (format) {
      logger.debug(
        `${ruleId}: error: type is omitted but format was specified.\n`
      );
      return [
        {
          message: formatButNoTypeErrorMsg,
          path,
        },
      ];
    }
    return [];
  }

  const errors = [];

  // Type is defined, so let's first make sure that it is a valid type.
  if (!validTypes.includes(type)) {
    errors.push({
      message: invalidTypeErrorMsg,
      path,
    });
  } else {
    // Type is valid, let's make sure format is valid for this type.
    switch (type) {
      case 'integer':
        if (format && !validIntegerFormats.includes(format)) {
          errors.push({
            message: integerFormatErrorMsg,
            path,
          });
        }
        break;
      case 'number':
        if (format && !validNumberFormats.includes(format)) {
          errors.push({
            message: numberFormatErrorMsg,
            path,
          });
        }
        break;
      case 'string':
        if (format && !validStringFormats.includes(format)) {
          errors.push({
            message: stringFormatErrorMsg,
            path,
          });
        }
        break;
      case 'boolean':
      case 'object':
      case 'array':
        // No valid formats for boolean, format should be undefined
        if (format !== undefined) {
          errors.push({
            message: `Schema of type ${type} should not have a format`,
            path,
          });
        }
        break;
    }
  }

  if (errors.length) {
    logger.debug(
      `${ruleId}: found these errors:\n${JSON.stringify(errors, null, 2)}`
    );
  } else {
    logger.debug(`${ruleId}: PASSED!`);
  }

  return errors;
}
