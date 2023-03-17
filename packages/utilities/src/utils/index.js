/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  getPropertyNamesForSchema: require('./get-property-names-for-schema'),
  ...require('./get-schema-type'),
  isObject: require('./is-object'),
  schemaHasConstraint: require('./schema-has-constraint'),
  schemaHasProperty: require('./schema-has-property'),
  schemaRequiresProperty: require('./schema-requires-property'),
  validateComposedSchemas: require('./validate-composed-schemas'),
  validateNestedSchemas: require('./validate-nested-schemas'),
  validateSubschemas: require('./validate-subschemas'),
};
