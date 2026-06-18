/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * This package provides utilities for working with OpenAPI 3.x definitions
 * in the context of a Spectral ruleset.
 * @module @ibm-cloud/openapi-ruleset-utilities
 */
import utils from './utils/index.js';
import collections from './collections/index.js';

// Export everything as default
export default {
  ...utils,

  collections: {
    ...collections,
  },
};

// Also export everything as named exports for backward compatibility
export const {
  collectFromComposedSchemas,
  getExamplesForSchema,
  getPropertyNamesForSchema,
  getSchemaType,
  SchemaType,
  isArraySchema,
  isBinarySchema,
  isBooleanSchema,
  isByteSchema,
  isDateSchema,
  isDateTimeSchema,
  isDoubleSchema,
  isEnumerationSchema,
  isFloatSchema,
  isInt32Schema,
  isInt64Schema,
  isIntegerSchema,
  isNumberSchema,
  isObjectSchema,
  isPrimitiveSchema,
  isStringSchema,
  schemaIsOfType,
  isObject,
  schemaHasConstraint,
  schemaHasProperty,
  schemaLooselyHasConstraint,
  schemaRequiresProperty,
  getNodes,
  getResolvedSpec,
  getUnresolvedSpec,
  validateComposedSchemas,
  validateNestedSchemas,
  validateSubschemas,
} = utils;

export { collections };
