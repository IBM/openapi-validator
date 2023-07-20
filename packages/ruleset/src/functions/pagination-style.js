/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  mergeAllOfSchemaProperties,
  LoggerFactory,
  getOffsetParamIndex,
  getPageTokenParamIndex,
  getSuccessCode,
  getResponseSchema,
  getPaginatedOperationFromPath,
} = require('../utils');
const {
  isIntegerSchema,
  isStringSchema,
} = require('@ibm-cloud/openapi-ruleset-utilities');

let ruleId;
let logger;

module.exports = function (pathObj, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return paginationStyle(pathObj, context.path);
};

/**
 * This function implements the pagination-style rule which performs numerous checks
 * on a "get" operation that is recognized as a paginated list operation.
 * An operation is considered to be a paginated "list"-type operation if:
 * 1. The path doesn't end in a path param reference (e.g. /v1/drinks vs /v1/drinks/{drink_id})
 * 2. The operation is a "get"
 * 3. The operation's response schema is an object containing an array property.
 * 4. The operation defines either an "offset" query param or a page token-type query param
 *    whose name is in ['start', 'token', 'cursor', 'page', 'page_token'].
 *
 * The specific checks that are performed are identified in the comments below (e.g. "Check #1").
 * Along with a description of each check, you'll find links to the API Handbook related to the check.
 * Also, there are comments in the corresponding testcase that refer to the various checks
 * to make it easy to cross-reference.
 *
 * @param {*} pathItem the path item that potentially contains a paginated "get" operation.
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function paginationStyle(pathItem, path) {
  logger.debug(`${ruleId}: checking pathItem at location: ${path.join('.')}`);
  const operation = getPaginatedOperationFromPath(pathItem, path, {
    logger,
    ruleId,
  });

  // If `operation` is null, this is not a paginated operation.
  if (!operation) {
    logger.debug(
      `${ruleId}: no paginated operation found at path '${path.join('.')}'`
    );

    return [];
  }

  //
  // If we made it this far, we know that the operation is at least attempting to
  // support pagination, so we'll perform the various checks below.
  //
  logger.debug(
    `${ruleId}: checking paginated operation at path ${path.join('.')}.get`
  );
  const results = [];

  // The actual path string (e.g. '/v1/resources') will be the last element in 'path'.
  const pathStr = path[path.length - 1];

  // Note: any operation returned from `getPaginatedOperationFromPath`
  // is guaranteed to have defined parameters.
  const params = operation.parameters;

  // Check #1: If the operation has a 'limit' query param, it must be type integer, optional,
  // and have default and maximum values.
  // References:
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-page-token
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-offset
  const limitParamIndex = params.findIndex(
    param => param.name === 'limit' && param.in === 'query'
  );
  if (limitParamIndex >= 0) {
    const limitParam = params[limitParamIndex];
    if (
      !limitParam.schema ||
      !isIntegerSchema(limitParam.schema) ||
      !!limitParam.required ||
      !limitParam.schema.default ||
      !limitParam.schema.maximum
    ) {
      results.push({
        message: `The 'limit' parameter must be of type integer and optional with default and maximum values`,
        path: [
          'paths',
          pathStr,
          'get',
          'parameters',
          limitParamIndex.toString(),
        ],
      });
    }
  }

  // Check #2: If the operation has an 'offset' query param, it must be type integer and optional.
  // Reference: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset
  const offsetParamIndex = getOffsetParamIndex(params);
  if (offsetParamIndex >= 0) {
    const offsetParam = params[offsetParamIndex];
    if (
      !offsetParam.schema ||
      !isIntegerSchema(offsetParam.schema) ||
      !!offsetParam.required
    ) {
      results.push({
        message: `The 'offset' parameter must be of type integer and optional`,
        path: [
          'paths',
          pathStr,
          'get',
          'parameters',
          offsetParamIndex.toString(),
        ],
      });
    }
  }

  // Check #3: If the operation has an 'offset' query param, then it must also have a 'limit' query param.
  // This is because the presence of the 'offset' param indicates offset/limit pagination.
  // Reference: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset-and-limit-pagination
  if (offsetParamIndex >= 0 && limitParamIndex < 0) {
    results.push({
      message: `The operation must define a 'limit' query parameter if the 'offset' query parameter is defined`,
      path: ['paths', pathStr, 'get'],
    });
  }

  // Check #4: If the operation has a page token-type query param, then it must be type string and optional,
  // and the name should be "start".
  // Reference: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#token-based-pagination
  const pageTokenParamIndex = getPageTokenParamIndex(params);
  if (pageTokenParamIndex !== -1) {
    const pageTokenParam = params[pageTokenParamIndex];
    if (pageTokenParam.name !== 'start') {
      results.push({
        message: `The '${pageTokenParam.name}' parameter should be named 'start'`,
        path: [
          'paths',
          pathStr,
          'get',
          'parameters',
          pageTokenParamIndex.toString(),
        ],
      });
    }
    if (
      !pageTokenParam.schema ||
      !isStringSchema(pageTokenParam.schema) ||
      !!pageTokenParam.required
    ) {
      results.push({
        message: `The '${pageTokenParam.name}' parameter must be of type string and optional`,
        path: [
          'paths',
          pathStr,
          'get',
          'parameters',
          pageTokenParamIndex.toString(),
        ],
      });
    }
  }

  // A valid successful response (with a schema) is guaranteed to be defined by
  // `getPaginatedOperationFromPath`.
  const successCode = getSuccessCode(operation);
  const responseSchema = getResponseSchema(operation.responses[successCode]);

  // Pre-defined path that points to the response schema.
  // We'll augment this path with additional segments in the checks that
  // are performed below.
  // Note, however, that the Spectral code that invokes our rule will
  // potentially modify the reported path in cases where it can't properly
  // "reverse map" the reported path (within the resolved document) back
  // to the equivalent path within the unresolved document.
  // This would typically occur, for example, if an allOf is used within the
  // response schema (which would be typical for a paginated response).
  // Nonetheless, we'll report the "correct" path here and our testcases will
  // just need to take into account this less-than-perfect reverse-mapping
  // performed by the Spectral code.
  const responseSchemaPath = [
    'paths',
    pathStr,
    'get',
    'responses',
    successCode,
    'content',
    'application/json',
    'schema',
  ];

  // Check #5: If the operation defines the "limit" query param, then the response body must also
  // contain a "limit" property that is type integer and required.
  // References:
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset
  if (limitParamIndex >= 0) {
    const limitProp = responseSchema.properties.limit;
    if (!limitProp) {
      results.push({
        message: `A paginated list operation with a 'limit' query parameter must include a 'limit' property in the response body schema`,
        path: responseSchemaPath,
      });
    } else if (
      !isIntegerSchema(limitProp) ||
      !responseSchema.required ||
      responseSchema.required.indexOf('limit') === -1
    ) {
      results.push({
        message: `The 'limit' property in the response body of a paginated list operation must be of type integer and required`,
        path: [...responseSchemaPath, 'properties', 'limit'],
      });
    }
  }

  // Check #6: If the operation has an "offset" query param, the response body schema
  // must also contain an "offset" property that is type integer and required.
  // Reference: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset
  if (offsetParamIndex !== -1) {
    const offsetProp = responseSchema.properties.offset;
    if (!offsetProp) {
      results.push({
        message: `A paginated list operation with an 'offset' query parameter must include an 'offset' property in the response body schema`,
        path: responseSchemaPath,
      });
    } else if (
      !isIntegerSchema(offsetProp) ||
      !responseSchema.required ||
      responseSchema.required.indexOf('offset') === -1
    ) {
      results.push({
        message: `The 'offset' property in the response body of a paginated list operation must be of type integer and required`,
        path: [...responseSchemaPath, 'properties', 'offset'],
      });
    }
  }

  // Check #7 is implemented in the collection-array-property rule.

  // Check #8: If the response body contains a "total_count" property, it must be type integer and required.
  // References:
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token
  // - https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset
  const tcProp = responseSchema.properties.total_count;
  if (tcProp) {
    if (
      !isIntegerSchema(tcProp) ||
      !responseSchema.required ||
      responseSchema.required.indexOf('total_count') === -1
    ) {
      results.push({
        message: `The 'total_count' property in the response body of a paginated list operation must be of type integer and required`,
        path: [...responseSchemaPath, 'properties', 'total_count'],
      });
    }
  }

  // Checks 9-12 below will verify that the response schema contains the
  // "first", "last", "previous", and "next" properties which are supposed to
  // provide links (in the form of a request url string) to the first/last/previous/next result pages.
  // Each of these properties should be an object that contains an "href" string property.
  // Reference: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#pagination-links

  // Check #9: The response body should contain a "first" property which links to the first page of results.
  results.push(
    ...checkPageLink(responseSchemaPath, responseSchema, 'first', true)
  );

  // Check #10: The response body should contain a "last" property which links to the last page of results.
  results.push(
    ...checkPageLink(responseSchemaPath, responseSchema, 'last', false)
  );

  // Check #11: The response body should contain a "previous" property which links to the previous page of results.
  results.push(
    ...checkPageLink(responseSchemaPath, responseSchema, 'previous', false)
  );

  // Check #12: The response body should contain a "next" property which links to the next page of results.
  results.push(
    ...checkPageLink(responseSchemaPath, responseSchema, 'next', true)
  );

  if (results.length > 0) {
    logger.debug(`${ruleId}: Results: ' + ${JSON.stringify(results, null, 2)}`);
  } else {
    logger.debug(`${ruleId}: PASSED!`);
  }

  return results;
}

// Verify that the '<name>' property exists within 'responseSchema'
// and represents a valid "page link" value (an object with an "href" field).
// The 'isRequired' flag indicates whether the specified property is required
// to be present or not.
function checkPageLink(path, responseSchema, name, isRequired) {
  const results = [];

  const pageLinkProp = responseSchema.properties[name];
  if (pageLinkProp) {
    const pageLinkSchema = mergeAllOfSchemaProperties(pageLinkProp);
    if (
      !pageLinkSchema ||
      !pageLinkSchema.properties ||
      !pageLinkSchema.properties.href ||
      !isStringSchema(pageLinkSchema.properties.href)
    ) {
      results.push({
        message: `The '${name}' property should be an object with an 'href' string property`,
        path: [...path, 'properties', name],
      });
    }
  } else if (isRequired) {
    results.push({
      message: `A paginated list operation should include a '${name}' property in the response body schema`,
      path,
    });
  }

  return results;
}
