const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');
const isObject = require('./is-object');

/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * define a property with the specified name.
 */
const checkCompositeSchemaForProperty = (schema, name) => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => 'properties' in s && isObject(s.properties[name])
  );
};

module.exports = checkCompositeSchemaForProperty;
