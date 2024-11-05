/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isArraySchema,
  isObject,
  validateComposedSchemas,
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

  return validateNestedSchemas(schema, context.path, checkForOptionalArrays);
};

/**
 * Checks "schema" for any optional array properties.
 * @param {*} schema the schema to check
 * @param {*} path the json path location of "schema"
 * @returns
 */
function checkForOptionalArrays(schema, path) {
  // If "schema" defines properties, then add an error for each optional array property.
  if (isObject(schema)) {
    logger.debug(
      `${ruleId}: examining object schema at location: ${path.join('.')}`
    );

    const errors = [];

    // We use 'validateNestedSchemas' at the top level to skip any composed
    // schema elements. They may be relying on the 'required' field for the
    // whole composed schema, and we lose that context if we process them in
    // isolation. Here, we use special logic to recursively look at composed
    // schemas as a whole, checking both the "top-level" required list and the
    // required list for each element that we find an array property in.
    validateComposedSchemas(schema, path, (s, p) => {
      for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
        if (Array.isArray(s[applicatorType])) {
          s[applicatorType].forEach((applicatorSchema, i) => {
            errors.push(
              ...validateProperties(
                applicatorSchema,
                [...p, applicatorType, i],
                applicatorSchema.required,
                // This is the required list for the whole composed schema.
                s.required
              )
            );
          });
        }
      }

      // validateComposedSchemas needs an array to be returned. We could gather
      // and return errors within this function, but it's easier to add them
      // directy to the 'errors' list we already have running.
      return [];
    });

    // Perform the standard check on the schema currently being processed.
    errors.push(...validateProperties(schema, path, schema.required));

    return errors;
  }

  return [];
}

function validateProperties(schema, path, localRequired, contextualRequired) {
  const requiredProps = localRequired || [];

  if (Array.isArray(contextualRequired)) {
    requiredProps.push(...contextualRequired);
  }

  const errors = [];
  if (isObject(schema.properties)) {
    for (const [name, prop] of Object.entries(schema.properties)) {
      if (isArraySchema(prop) && !requiredProps.includes(name)) {
        errors.push({
          message: 'In a response body, an array field MUST NOT be optional',
          path: [...path, 'properties', name],
        });
      }
    }
  }

  return errors;
}
