/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isArraySchema,
  isDateSchema,
  isDateTimeSchema,
  isIntegerSchema,
  isObject,
  isObjectSchema,
  isStringSchema,
  schemaHasConstraint,
  validateSubschemas,
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
    context.documentInventory.resolved
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
  const examples = [];
  const propertyPath = [];

  return validateSubschemas(s, p, (schema, path) => {
    logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);

    // Check for any examples outside of the schema path - they may be in
    // request bodies, response bodies, or parameters.
    examples.push(...checkForIndirectExamples(path, apidef));

    // We can look at primitive schemas directly but for objects and arrays,
    // we need more specialized handling in case we need to find a particular
    // property within their examples.
    if (isObjectSchema(schema) || isArraySchema(schema)) {
      // Maintain a running path to each schema that we look at. This will be
      // used to determine where to look for a property value within an example
      // object, relative to that example's location.
      if (isSchemaProperty(path)) {
        propertyPath.push(path.at(-1));
      }

      // Keep a running hierarchy of all examples we find as we look through
      // the schemas in the API. Nested properties may only have an example
      // value defined within a parent schema example.
      if (schema.example) {
        logger.debug(
          `${ruleId}: adding example for schema at location: ${path.join('.')}`
        );

        examples.push({
          example: schema.example,
          examplePath: propertyPath.slice(), // Use a copy to prevent modification.
        });
      }

      // Add sentinels for arrays/dictionaries to the running path,
      // to assist the example-parsing logic later on. This must come
      // after we push the example to the list.
      if (isSchemaProperty(path)) {
        if (isArraySchema(schema)) {
          propertyPath.push('[]');
        }

        if (isDictionarySchema(schema)) {
          propertyPath.push('{}');
        }
      }
    }

    // Use a slice (a copy) of the `propertyPath` array so that the
    // invoked function can modify it without modifying the original.
    return performValidation(
      schema,
      path,
      apidef,
      propertyPath.slice(),
      examples
    );
  });
}

// This function performs the actual checks against a schema to determine if
// it should be a "date" or "date-time" schema, but isn't defined as one.
// It is wrapped in the outer function for the gathering of examples, etc. but
// this function implements the checks: 1) see if the name of a property
// indicates that it is a date-based schema and 2) see if the example value for
// a schema indicates that it is a date-based schema.
function performValidation(schema, path, apidef, propertyPath, examples) {
  // If this is already a date or date-time schema, no need to check if it should be.
  if (isDateSchema(schema) || isDateTimeSchema(schema)) {
    logger.debug(
      `${ruleId}: skipping date-based schema at location: ${path.join('.')}`
    );

    return [];
  }

  // Check for a name that would indicate the property should be date-based.
  const hasDateTimeName =
    isSchemaProperty(path) && isDateBasedName(path.at(-1));

  logger.debug(
    `${ruleId}: property at location: ${path.join('.')} has a date-based name`
  );

  if (hasDateTimeName && (isStringSchema(schema) || isIntegerSchema(schema))) {
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

  // Check example values for string schemas.
  if (isStringSchema(schema)) {
    // If this is a property, we need to include its name in the path.
    if (isSchemaProperty(path)) {
      propertyPath.push(path.at(-1));
    }

    // Either use the schema example directly or search the list of examples
    // for an example object that contains a value for this property.
    const exampleValue = schema.example || findExample(propertyPath, examples);
    if (exampleValue) {
      logger.debug(
        `${ruleId}: example value found for string schema at location ${path.join(
          '.'
        )}: ${exampleValue}`
      );

      if (isDateBasedValue(exampleValue)) {
        return [
          {
            message:
              'According to its example value, this schema should use type "string" and format "date" or "date-time"',
            path,
          },
        ];
      }
    }
  }

  return [];
}

// This function checks all of the examples we've gathered while processing
// schemas to check if once of them defines a value for the specific property
// or string schema that we are looking at. It returns the first value found.
function findExample(propertyPath, examples) {
  let exampleValue;

  // According to the OpenAPI specification, Media Type/Parameter examples
  // override any examples defined on the schemas themselves. Going "in order"
  // through this loop ensures we prioritize those examples, followed by
  // higher-level schema examples. If it turns out that we should prioritize
  // nested examples, we can simply reverse this loop.
  for (const { example, examplePath } of examples) {
    // First thing is to find the relevant segment of the property path relative
    // to the example path, which should be the first element where they differ.
    const index = propertyPath.findIndex((prop, i) => prop !== examplePath[i]);
    const value = getObjectValueAtPath(example, propertyPath.slice(index));

    // If we find a value, go ahead and break from the loop.
    if (value) {
      logger.debug(
        `${ruleId}: value found in example at location: ${examplePath.join(
          '.'
        )}`
      );

      exampleValue = value;
      break;
    }
  }

  logger.debug(
    `${ruleId}: no example value found for schema at location: ${propertyPath.join(
      '.'
    )}`
  );

  // This will return `undefined` if we never find a value;
  return exampleValue;
}

// This function takes an object, as well as a path to a specific value, and
// recursively parses the object looking for the value at that path. If it
// finds one, the value will be returned. If not, the function will return
// `undefined`. One important note is that the array given as the `pathToValue`
// argument *will* be modified by the logic, so if that is not desired, a copy
// should be passed by the caller (using .slice(), for example).
function getObjectValueAtPath(obj, pathToValue) {
  // If obj is undefined, there is nothing to process.
  if (obj === undefined) {
    return;
  }

  // If we've exhausted the whole path, we've found the desired value!
  if (!pathToValue.length) {
    return obj;
  }

  const p = pathToValue.shift();

  // Check for sentinel indicating an array.
  if (p === '[]' && Array.isArray(obj) && obj.length) {
    return getObjectValueAtPath(obj[0], pathToValue);
  }

  // Check for sentinel indicating a dictionary.
  if (p === '{}' && isObject(obj) && Object.values(obj).length) {
    return getObjectValueAtPath(Object.values(obj)[0], pathToValue);
  }

  // Standard model path.
  if (obj[p]) {
    return getObjectValueAtPath(obj[p], pathToValue);
  }

  // Return undefined if we don't find anything.
  return;
}

// "Indirect" examples are those coming from request bodies, response bodies, and parameters.
function checkForIndirectExamples(path, apidef) {
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
    return examples.map(example => {
      return {
        example,
        examplePath: [], // All top-level examples get an empty array for the path.
      };
    });
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

// This function determines if a schema is a "dictionary" (as opposed to a
// standard model with static properties) based on the presence of either
// `additionalProperties` or `patternProperties` (OpenAPI 3.1 only).
function isDictionarySchema(schema) {
  return schemaHasConstraint(
    schema,
    s => isObjectSchema(s) && (s.additionalProperties || s.patternProperties)
  );
}
