/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getExamplesForSchema,
  isDateSchema,
  isDateTimeSchema,
  isIntegerSchema,
  isObject,
  isStringSchema,
  validateNestedSchemas,
  getResolvedSpec,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  LoggerFactory,
  isDateBasedName,
  isDateBasedValue,
  isParamContentSchema,
  isParamSchema,
  isRequestBodySchema,
  isResponseSchema,
  isSchemaProperty,
} = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - oas3-valid-media-example
 * - oas3-valid-schema-example
 *
 * These rules verify that the correct, specific format (date vs date-time) is
 * used for schemas based on their example value. So, we aren't as specific
 * with that check in this rule - we recommend either "date" or "date-time".
 */

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return checkForDateBasedFormat(
    schema,
    context.path,
    getResolvedSpec(context)
  );
};

/**
 * This function implements a rule that enforces date-based schemas use either
 * the "date" or "date-time" format, so that they're accurately documented as
 * date-based logical types. We use a heuristic based on either the name of a
 * schema (derived from the property name, if the schema is a property schema)
 * or the example value provided for a given schema or schema property.
 *
 * The logic here recursively checks all schemas for the presence of unmarked
 * date-based schemas. As it traverses the schemas, it compiles a list of
 * potentially-relevant example values. This way, if an object schema defines
 * its own example, which includes a value for a nested property that should
 * be identified by the rule, we can track down the value once we reach the
 * schema for said property. The logic will also gather any relevant parameter
 * or media type examples that may be defined outside of the schema path.
 *
 * @param {object} s the schema to check
 * @param {array} p the array of path segments indicating the "location" of the schema within the API definition
 * @param {object} apidef the resolved API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForDateBasedFormat(s, p, apidef) {
  // Map connecting a list of examples for a schema to its logical path.
  const examples = {};

  // Check for any examples outside of the schema path - they may be in
  // request bodies, response bodies, or parameters. Store these separately.
  const indirectExamples = checkForIndirectExamples(p, apidef);

  return validateNestedSchemas(s, p, (schema, path, logicalPath) => {
    logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);
    logger.debug(
      `${ruleId}: logical schema path is : ${logicalPathForLogger(logicalPath)}`
    );

    // Use a composition-aware utility to gather any examples relevant to this
    // schema, including those defined on applicator schemas in oneOf, etc.
    const schemaExamples = getExamplesForSchema(schema);
    logger.debug(`${ruleId}: ${schemaExamples.length} examples found`);

    // Examples have already been stored on the parent - as we go through the
    // schemas, check for the presence of an example value for the current
    // property within the parent's example.
    const parentalExamples =
      // If the logical path is empty, there are no parents, but there may be
      // indirect examples to add in the ":" branch.
      logicalPath.length > 0
        ? // Look at the example values for the logical parent schema, if any.
          // For successive, nested properties, this will end up propagating
          // examples through the recursive descent so that example values
          // separated from a property by multiple degrees of nesting will
          // still be preserved.
          examples[logicalPath.slice(0, -1).join('.')]
            .map(e => {
              // Check the parental example values for
              // the presence of the current property.
              const prop = logicalPath.at(-1);

              // Check for sentinel indicating an array.
              if (prop === '[]' && Array.isArray(e)) {
                return e;
              }

              // Check for sentinel indicating a dictionary.
              if (prop === '*' && isObject(e)) {
                return Object.values(e);
              }

              // Standard model path. Wrap value in an array to match list and
              // dictionary behavior - it will be flattened out later.
              return [e[prop]];
            })

            // Each example may map to multiple examples - flatten the result
            // of the mapping to include all relevant examples in the list.
            .flat()

            // We are not guaranteed to find a value - filter
            // out any values that are not defined.
            .filter(e => e !== undefined)
        : // Add indirect examples to the map - note that they will necessarily
          // be indexed with the empty string key, like primary schemas.
          indirectExamples;

    logger.debug(
      `${ruleId}: ${parentalExamples.length} examples found in logical parent`
    );

    // Index the examples with the stringified logical path.
    // Note that the unconditional assignment is intentional - there may be
    // existing entries for this same logical path (e.g. for the same
    // nested property within a different oneOf sibling) but we want to
    // override them, always. Otherwise, the behavior would depend on the
    // order the schemas are checked in (the logic may look at more examples
    // for one instance of a property than another, arbitrarily) and we don't
    // make a guarantee that order will be stable in `validateNestedSchemas`.
    examples[logicalPath.join('.')] = [
      ...schemaExamples,
      ...parentalExamples,
    ].filter(e => e !== null); // Null values are technically allowed - don't keep them.

    // Perform the validation using the first value example value found for the
    // schema at this logical path.
    const exampleValue = examples[logicalPath.join('.')].find(
      e => e !== undefined
    );

    return performValidation(schema, path, exampleValue);
  });
}

// This function performs the actual checks against a schema to determine if
// it should be a "date" or "date-time" schema, but isn't defined as one.
// It is wrapped in the outer function for the gathering of examples, etc. but
// this function implements the checks: 1) see if the name of a property
// indicates that it is a date-based schema and 2) see if the example value for
// a schema indicates that it is a date-based schema.
function performValidation(schema, path, exampleValue) {
  // If this is already a date or date-time schema, no need to check if it should be.
  if (isDateSchema(schema) || isDateTimeSchema(schema)) {
    logger.debug(
      `${ruleId}: skipping date-based schema at location: ${path.join('.')}`
    );

    return [];
  }

  // Check if this is a schema property
  if (isSchemaProperty(path)) {
    logger.debug(`${ruleId}: detected named property at "${path.join('.')}"`);

    // Check for a name that would indicate the property should be date-based
    if (isDateBasedName(path.at(-1))) {
      logger.debug(
        `${ruleId}: property name at "${path.join('.')}" is date-based`
      );

      // We only assume a property could be a date-time value if it's a string or integer
      if (isStringSchema(schema) || isIntegerSchema(schema)) {
        logger.debug(
          `${ruleId}: date-based property name at "${path.join(
            '.'
          )}" is a string or integer`
        );

        // If the schema is determined to be a date-time schema by the name alone,
        // we can return - no need to look for an example value.
        return [
          {
            message:
              'According to its name, this property should use type "string" and format "date" or "date-time"',
            path,
          },
        ];
      }
    }
  }

  // Check example values for string schemas.
  if (isStringSchema(schema)) {
    if (exampleValue !== undefined) {
      logger.debug(`${ruleId}: example value found: ${exampleValue}`);

      if (isDateBasedValue(exampleValue)) {
        return [
          {
            message:
              'According to its example value, this schema should use type "string" and format "date" or "date-time"',
            path,
          },
        ];
      }
    } else {
      logger.debug(`${ruleId}: no example value found`);
    }
  }

  return [];
}

// This function takes an object, as well as a path to a specific value, and
// parses the object, looking for the value at that path. If it finds one,
// the value will be returned. If not, the function will return `undefined`.
function getObjectValueAtPath(obj, pathToValue) {
  return pathToValue.reduce((value, field) => value?.[field], obj);
}

// "Indirect" examples are those coming from request bodies, response bodies, and parameters.
function checkForIndirectExamples(path, apidef) {
  logger.debug(
    `${ruleId}: checking indirect examples for schema at location: ${path.join(
      '.'
    )}`
  );

  // Parameter and Media Type objects have the same format when it comes
  // to examples, so we can treat all of these scenarios the same way.
  if (
    isRequestBodySchema(path) ||
    isResponseSchema(path) ||
    isParamSchema(path) ||
    isParamContentSchema(path)
  ) {
    // Example fields would be siblings of the schema we're looking at, so we need to look in the API
    // for the path, minus the last value (which is "schema").
    const examples = getOpenApiExamples(
      getObjectValueAtPath(apidef, path.slice(0, -1))
    );

    // Check for the special case of looking at a content schema for a parameter that
    // itself defines an example (pull the last three values off the path to check).
    if (isParamContentSchema(path)) {
      examples.push(
        ...getOpenApiExamples(getObjectValueAtPath(apidef, path.slice(0, -3)))
      );
    }

    logger.debug(
      `${ruleId}: ${
        examples.length
      } indirect examples found for schema at location: ${path.join('.')}`
    );

    // Put the examples in the format the downstream algorithm for this rule needs.
    return examples;
  }

  return [];
}

// OpenAPI defines its own example structure, separate from schema examples,
// on Parameter and Media Type objects. Use this function to parse those
// structures and return any relevant examples. The argument may be either a
// Parameter or Media Type object and will return a list.
function getOpenApiExamples(artifact) {
  if (!isObject(artifact)) {
    return [];
  }

  // The `example` and `examples` fields are mutually exclusive.
  if (artifact.example) {
    return [artifact.example];
  }

  // This will be a map, potentially containing multiple examples. Return all of them.
  if (artifact.examples) {
    return Object.values(artifact.examples).map(
      exampleObject => exampleObject.value
    );
  }

  return [];
}

// Format the logical path in a way that makes sense when the array is empty.
function logicalPathForLogger(logicalPath) {
  if (!logicalPath.length) {
    return `'' (primary schema)`;
  }

  return `'${logicalPath.join('.')}'`;
}
