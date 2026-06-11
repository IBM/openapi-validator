/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

export default {
  collectFromComposedSchemas: require('./collect-from-composed-schemas')
    .default,
  getExamplesForSchema: require('./get-examples-for-schema'),
  getPropertyNamesForSchema: require('./get-property-names-for-schema'),
  ...require('./get-schema-type').default,
  isObject: require('./is-object').default,
  schemaHasConstraint: require('./schema-has-constraint').default,
  schemaHasProperty: require('./schema-has-property').default,
  schemaLooselyHasConstraint: require('./schema-loosely-has-constraint')
    .default,
  schemaRequiresProperty: require('./schema-requires-property').default,
  ...require('./spectral-context-utils').default,
  validateComposedSchemas: require('./validate-composed-schemas').default,
  validateNestedSchemas: require('./validate-nested-schemas').default,
  validateSubschemas: require('./validate-subschemas').default,
};
