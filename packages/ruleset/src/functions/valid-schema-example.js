/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validate } = require('jsonschema');
const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, checkSchemaExamples);
};

function checkSchemaExamples(schema, path) {
  if (!isDefined(schema.example) && !definesElements(schema.examples)) {
    return [];
  }

  const examplesToCheck = [];

  if (definesElements(schema.examples)) {
    schema.examples.forEach((example, i) => {
      examplesToCheck.push({
        schema,
        example,
        path: [...path, 'examples', i],
      });
    });
  }

  if (isDefined(schema.example)) {
    examplesToCheck.push({
      schema,
      example: schema.example,
      path: [...path, 'example'],
    });
  }

  return validateExamples(examplesToCheck);
}

function validateExamples(examples) {
  return examples
    .map(({ schema, example, path }) => {
      // Setting required: true prevents undefined values from passing validation.
      const { valid, errors } = validate(example, schema, { required: true });
      if (!valid) {
        const message = getMessage(errors, example, schema);
        return {
          message: `Schema example is not valid: ${message}`,
          path,
        };
      }
    })
    .filter(e => isDefined(e));
}

function isDefined(x) {
  return x !== undefined;
}

function definesElements(arr) {
  return Array.isArray(arr) && arr.length;
}

function getMessage(errors, example, schema) {
  let message = getPrimaryErrorMessage(errors);

  const primaryError = errors[0];
  if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
    // If a schema has a oneOf or anyOf, jsonschema will supress nested validation
    // error messages by default. If this is the case, compute those messages and
    // append them to the primary message (on their own, they don't include context
    // and thus wouldn't be very helpful).
    const { errors } = validate(example, schema, { nestedErrors: true });
    message = appendMessage(message, getPrimaryErrorMessage(errors));
  } else if (Array.isArray(primaryError.argument?.valid?.errors)) {
    // Sometimes, jsonschema buries additional error info in the 'argument'
    // field of the validation result. If so, extract and include it.
    message = appendMessage(
      message,
      getPrimaryErrorMessage(primaryError.argument.valid.errors)
    );
  }

  return message;
}

function getPrimaryErrorMessage(errors) {
  const { path } = errors[0];
  let { message } = errors[0];

  // If the violation is nested within an object or array, this field will hold
  // the path segments to the violation, which is necessary context for the user.
  if (path.length) {
    message = `${path.join('.')} ${message}`;
  }

  // Sometimes, jsonschema appends a confusing message to an error - remove it.
  return message.replace(/ with \d+ error\[s\]:$/, '');
}

function appendMessage(msg, app) {
  return `${msg} (${app})`;
}
