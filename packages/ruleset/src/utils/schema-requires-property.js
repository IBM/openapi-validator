const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');
const checkCompositeSchemaForProperty = require('./check-composite-schema-for-property');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * require a property with the specified name. Note that this method may not behave as expected
 * for OpenAPI documents which contain violations of the `missing-required-property` rule.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {object} name - Name of a property.
 * @returns {boolean}
 */
const schemaRequiresProperty = (schema, name) => {
  return (
    checkCompositeSchemaForConstraint(
      schema,
      s => Array.isArray(s.required) && s.required.includes(name)
    ) && checkCompositeSchemaForProperty(schema, name)
  );
};

module.exports = schemaRequiresProperty;
