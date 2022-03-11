const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * require a property with the specified name.
 */
const schemaRequiresProperty = (schema, name) => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => Array.isArray(s.required) && s.required.includes(name)
  );
};

module.exports = schemaRequiresProperty;
