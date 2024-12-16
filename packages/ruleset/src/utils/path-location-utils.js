/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const pathMatchesRegexp = require('./path-matches-regexp');

/**
 * Returns true if the path points to a schema object within
 * a media type object defined on a parameter's content field.
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a parameter content schema object
 */
function isParamContentSchema(path) {
  // ...parameters[n].content.*.schema
  return pathMatchesRegexp(
    path,
    /^paths,.+,parameters,\d+,content,[^,]+,schema$/
  );
}

/**
 * Returns true if the path points to a schema object defined
 * directly on a parameter.
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a parameter schema object
 */
function isParamSchema(path) {
  // Schema for a parameter within a path item or operation:
  // ...parameters[n].schema
  return pathMatchesRegexp(path, /^paths,.+,parameters,\d+,schema$/);
}

/**
 * Returns true if the path points to a schema object that
 * is a "primary" schema, meaning it is not the schema of a
 * parameter or a property of another schema. This ultimately
 * translates to "content" schemas (for request bodies,
 * response bodies, and parameters).
 *
 * So a primary schema is one with a path like:
 * - ["paths", "/v1/drinks", "requestBody", "content", "application/json", "schema"]
 *
 * but not one with a path like these:
 * - ["paths", "/v1/drinks", "parameters", "0", "schema"]
 * - ["paths", "/v1/drinks", "requestBody", "content", "application/json", "schema", "properties", "prop1"]
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a primary, non-property schema
 */
function isPrimarySchema(path) {
  // Note: the regexp used below uses a "lookbehind assertion"
  // (i.e. the "(?<!properties)" part) to ensure we don't match any
  // schemas in "properties" that may have names like "content" or "schema".
  return pathMatchesRegexp(path, /^.*(?<!properties),content,[^,]+,schema$/);
}

/**
 * Returns true if the path points to a schema object within
 * a media type object defined on a request body.
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a request body content schema object
 */
function isRequestBodySchema(path) {
  return pathMatchesRegexp(path, /^paths,.+,requestBody,content,[^,]+,schema$/);
}

/**
 * Returns true if the path points to a schema object within
 * a media type object defined on a response body.
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a response body content schema object
 */
function isResponseSchema(path) {
  return pathMatchesRegexp(
    path,
    /^paths,([^,]+,){2}responses,[^,]+,content,[^,]+,schema$/
  );
}

/**
 * Returns true if the path points to a schema object that is
 * explictly defined as a property of another object schema.
 *
 * @param {array} path the path to the openapi artifact
 * @returns true if path is to a schema property schema object
 */
function isSchemaProperty(path) {
  const matches = pathMatchesRegexp(path, /^.+,properties,[^,]+$/);

  // Handle the rare edge case where a property is named "properties"
  // and we end up in its properties field, which should return false.
  // This scenario is rather difficult to handle with a regular expression.
  if (matches && path.at(-1) === 'properties') {
    // Count the amount of times the segment 'properties' occurs at the end
    // of the path. Look for an even number.
    const count = path
      .slice()
      .reverse()
      .findIndex(p => p !== 'properties');

    return count % 2 === 0;
  }

  return matches;
}

module.exports = {
  isParamContentSchema,
  isParamSchema,
  isPrimarySchema,
  isRequestBodySchema,
  isResponseSchema,
  isSchemaProperty,
};
