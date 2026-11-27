/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import collectFromComposedSchemas from './collect-from-composed-schemas.js';
import getExamplesForSchema from './get-examples-for-schema.js';
import getPropertyNamesForSchema from './get-property-names-for-schema.js';
import getSchemaType from './get-schema-type.js';
import isObject from './is-object.js';
import schemaHasConstraint from './schema-has-constraint.js';
import schemaHasProperty from './schema-has-property.js';
import schemaLooselyHasConstraint from './schema-loosely-has-constraint.js';
import schemaRequiresProperty from './schema-requires-property.js';
import spectralContextUtils from './spectral-context-utils.js';
import validateComposedSchemas from './validate-composed-schemas.js';
import validateNestedSchemas from './validate-nested-schemas.js';
import validateSubschemas from './validate-subschemas.js';

export default {
  collectFromComposedSchemas,
  getExamplesForSchema,
  getPropertyNamesForSchema,
  ...getSchemaType,
  isObject,
  schemaHasConstraint,
  schemaHasProperty,
  schemaLooselyHasConstraint,
  schemaRequiresProperty,
  ...spectralContextUtils,
  validateComposedSchemas,
  validateNestedSchemas,
  validateSubschemas,
};
