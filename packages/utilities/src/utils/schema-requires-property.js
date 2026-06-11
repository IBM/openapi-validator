/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
import schemaHasConstraint from './schema-has-constraint';
/**
 * @private
 */
import schemaHasProperty from './schema-has-property';

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * require a property with the specified name. Note that this method may not behave as expected
 * for OpenAPI documents where a `required` property is not defined under the `properties` keyword.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {object} propertyName name of the object schema property to check for
 * @returns {boolean}
 */
function schemaRequiresProperty(schema, propertyName) {
  return (
    schemaHasConstraint(
      schema,
      s => Array.isArray(s.required) && s.required.includes(propertyName)
    ) && schemaHasProperty(schema, propertyName)
  );
}

export default schemaRequiresProperty;
