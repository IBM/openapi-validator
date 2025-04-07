/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemaHasConstraint,
  isArraySchema,
  isObject,
  getUnresolvedSpec,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return collectionArrayProperty(
    schema,
    context.path,
    getUnresolvedSpec(context)
  );
};

/**
 * This function checks to make sure that for a collection "list" type operation,
 * the collection's array property name matches the final path segment of the operation's path.
 * For example, suppose that 'GET /v1/things' (presumably the "list_things" operation) returns an instance
 * of the ThingCollection schema.  We'll check to make sure that the schema contains an array
 * property named "things" since that is the final path segment.
 * @param {*} schema a "success" response schema for a GET operation
 * @param {*} path the array of path segments indicating the "location" of "schema" within the API definition
 * @param {*} apidef the unresolved API definition (the rule only deals with paths and operations)
 * @returns an array containing the violations found or [] if no violations
 */
function collectionArrayProperty(schema, path, apidef) {
  logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);

  const pathString = path[1];
  if (!apidef.paths[pathString]) {
    // Spectral has weird behavior where if it finds unexpected characters, like
    // an apostrophe, it wraps the path segment in quotes. In that case, of course,
    // the path string won't be in the paths object. Until we better understand the
    // Spectral behavior, we should just skip this path.
    logger.error(
      `${ruleId}: could not find path object. Check path ${pathString} for unusual characters. Skipping check...`
    );
    return [];
  }

  // Grab the GET operation that defines "schema" as the success response schema.
  const operation = apidef.paths[pathString].get;

  // If this is a collection "list"-type operation, then check to make sure
  // that "schema" defines an array property named after the last path segment.
  if (isListOperation(operation, pathString, apidef)) {
    logger.debug('Detected list-type operation');
    const pathSegments = pathString.split('/');
    const propertyName = pathSegments[pathSegments.length - 1];
    if (!checkCompositeSchemaForArrayProperty(schema, propertyName)) {
      logger.debug(`Couldn't find array property named '${propertyName}'`);
      return [
        {
          message: `Collection list operation response schema should define array property with name: ${propertyName}`,
          path,
        },
      ];
    }
  }
  return [];
}

/**
 * Returns true iff "operation" is considered to be a collection "list" operation.
 * @param {} operation the operation to check
 * @param {*} path the operation's path string (e.g. '/v1/things')
 * @param {*} apidef the resolved API spec
 * @returns boolean
 */
function isListOperation(operation, path, apidef) {
  // Note that, if the operation is defined, we already know it is a "get" due
  // to the rule's "given" field.
  if (!operation) {
    return false;
  }

  // 1. If the operation id starts with "list", we'll assume it's a collection list operation.
  if (operation.operationId && /^list.*$/.test(operation.operationId)) {
    return true;
  }

  // 2. Next, check to see if the final path segment is a path parameter reference.
  // If so, this is not a list operation.
  const pathSegments = path.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  // To cast a wider net, we'll just look to see if '{' or '}' are in
  // the path segment.  If so, we'll consider that a path param reference and bail out.
  if (lastSegment.indexOf('{') >= 0 || lastSegment.indexOf('}') >= 0) {
    return false;
  }

  // 3. Is there a sibling path that ends in a path param reference?
  const siblingPathRE = new RegExp(`^${path}/{[^{}/]+}$`);
  const siblingPath = Object.keys(apidef.paths).find(p =>
    siblingPathRE.test(p)
  );

  return !!siblingPath;
}

/**
 * Returns true iff "schema" defines an array property named "name".
 * The property could be defined directly in "schema" or as part of
 * a composed schema (e.g. allOf)
 * @param {*} schema the schema to check
 * @param {*} name the name of the array property to look for
 * @returns boolean true if the array property was found, false otherwise
 */
function checkCompositeSchemaForArrayProperty(schema, name) {
  return schemaHasConstraint(
    schema,
    s =>
      'properties' in s &&
      isObject(s.properties[name]) &&
      isArraySchema(s.properties[name])
  );
}
