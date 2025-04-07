/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  collectFromComposedSchemas: require('./collect-from-composed-schemas'),
  getExamplesForSchema: require('./get-examples-for-schema'),
  getPropertyNamesForSchema: require('./get-property-names-for-schema'),
  ...require('./get-schema-type'),
  isObject: require('./is-object'),
  schemaHasConstraint: require('./schema-has-constraint'),
  schemaHasProperty: require('./schema-has-property'),
  schemaLooselyHasConstraint: require('./schema-loosely-has-constraint'),
  schemaRequiresProperty: require('./schema-requires-property'),
  ...require('./spectral-context-utils'),
  validateComposedSchemas: require('./validate-composed-schemas'),
  validateNestedSchemas: require('./validate-nested-schemas'),
  validateSubschemas: require('./validate-subschemas'),
};
