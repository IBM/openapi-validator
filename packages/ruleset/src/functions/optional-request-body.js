/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCompositeSchemaAttribute } = require('../utils');
const { LoggerFactory } = require('../utils');

const oldRuleId = 'ibm-no-optional-properties-in-required-body';
const newRuleId = 'ibm-no-required-properties-in-optional-body';

/**
 * This function assumes that "schema" is the schema defined for
 * an optional requestBody object, and will return a warning if
 * "schema" contains any required properties.
 * @param {*} schema the schema to check
 * @param {*} _unused_options unused parameter
 * @param {*} context the execution context of the rule
 * @returns an error object, or [] if no rule violation was found
 */
function optionalRequestBody(schema, _unused_options, context) {
  const path = context.path;

  // If the schema has any required properties, then return a warning.
  const required = getCompositeSchemaAttribute(schema, 'required');
  if (Array.isArray(required)) {
    return [
      {
        message: '',

        // Return the path to the requestBody, not the schema.
        path: path.slice(0, 4),
      },
    ];
  }

  return [];
}

let oldLogger;

/**
 * This is a wrapper around "optionalRequestBody()" which just logs a deprecation
 * message, then delegates to "optionalRequestBody()".
 * This function will be invoked only if a user explicitly enables the deprecated
 * 'ibm-no-optional-properties-in-required-body' validation rule (which is 'off' by default).
 *
 * @param {*} schema the schema to check
 * @param {*} _unused_options unused paraemter
 * @param {*} context the execution context of the rule
 * @returns an error object, or [] if no rule violation was found
 */
function optionalRequestBodyDeprecated(schema, _unused_options, context) {
  if (!oldLogger) {
    oldLogger = LoggerFactory.getInstance().getLogger(oldRuleId);
    if (context.rule && context.rule.definition) {
      const severity = context.rule.definition.severity;
      if (
        (typeof severity === 'number' && severity >= 0) ||
        (typeof severity === 'string' && severity !== 'off')
      ) {
        oldLogger.warn(
          `The '${oldRuleId}' rule is deprecated.  Please use the '${newRuleId}' rule instead.`
        );
      }
    }
  }

  return optionalRequestBody(schema, _unused_options, context);
}

module.exports = {
  optionalRequestBody,
  optionalRequestBodyDeprecated,
};
