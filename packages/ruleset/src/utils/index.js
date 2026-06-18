/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import computeRefsAtPaths from './compute-refs-at-paths.js';
import getCompositeSchemaAttribute from './get-composite-schema-attribute.js';
import getResourceSpecificSiblingPath from './get-resource-specific-sibling-path.js';
import getResourceOrientedPaths from './get-resource-oriented-paths.js';
import getResponseCodes from './get-response-codes.js';
import getSchemaNameAtPath from './get-schema-name-at-path.js';
import isCreateOperation from './is-create-operation.js';
import isDeprecated from './is-deprecated.js';
import isEmptyObjectSchema from './is-empty-object-schema.js';
import isOperationOfType from './is-operation-of-type.js';
import isRefSiblingSchema from './is-ref-sibling-schema.js';
import isRequestBodyExploded from './is-requestbody-exploded.js';
import LoggerFactory from './logger-factory.js';
import mergeAllOfSchemaProperties from './merge-allof-schema-properties.js';
import nestedSchemaKeys from './nested-schema-keys.js';
import operationMethods from './constants.js';
import pathHasMinimallyRepresentedResource from './path-has-minimally-represented-resource.js';
import pathMatchesRegexp from './path-matches-regexp.js';
import dateBasedUtils from './date-based-utils.js';
import mimetypeUtils from './mimetype-utils.js';
import paginationUtils from './pagination-utils.js';
import pathLocationUtils from './path-location-utils.js';
import * as schemaFindingUtils from './schema-finding-utils.js';

export {
  computeRefsAtPaths,
  getCompositeSchemaAttribute,
  getResourceSpecificSiblingPath,
  getResourceOrientedPaths,
  getResponseCodes,
  getSchemaNameAtPath,
  isCreateOperation,
  isDeprecated,
  isEmptyObjectSchema,
  isOperationOfType,
  isRefSiblingSchema,
  isRequestBodyExploded,
  LoggerFactory,
  mergeAllOfSchemaProperties,
  nestedSchemaKeys,
  operationMethods,
  pathHasMinimallyRepresentedResource,
  pathMatchesRegexp,
};

// Re-export all named exports from utility modules
export const {
  isDateBasedName,
  isDateBasedValue,
} = dateBasedUtils;

export const {
  isFormMimeType,
  isJsonMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
  supportsJsonContent,
} = mimetypeUtils;

export const {
  getOffsetParamIndex,
  getLimitParamIndex,
  getPageTokenParamIndex,
  getSuccessCode,
  getResponseSchema,
  getPaginatedOperationFromPath,
} = paginationUtils;

export const {
  isParamContentSchema,
  isParamSchema,
  isPrimarySchema,
  isRequestBodySchema,
  isResponseSchema,
  isSchemaProperty,
  isPathParam,
  pathHasTemplates,
  pathMatchesTemplate,
} = pathLocationUtils;

export const {
  getSuccessResponseSchemaForOperation,
  getRequestBodySchemaForOperation,
  getCanonicalSchemaForPath,
} = schemaFindingUtils;

// Made with Bob
