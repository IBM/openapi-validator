const getAllComposedSchemas = require('./get-all-composed-schemas');
const isObject = require('./is-object');

/**
 * Returns an array of property names for a simple or composite schema,
 * optionally filtered by a lambda function.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object
 * @param {function} schemaFilter(propertyName, propertySchema) - Lambda filter for properties
 * @returns {array} - Array of property names defined for a schema
 */
const getPropertyNamesForSchema = (schema, propertyFilter = () => true) => {
  const propertyNames = [];
  const schemas = getAllComposedSchemas(schema);

  for (const s of schemas) {
    if (isObject(s.properties)) {
      for (const propertyName of Object.keys(s.properties)) {
        if (propertyFilter(propertyName, s.properties[propertyName])) {
          propertyNames.push(propertyName);
        }
      }
    }
  }

  return [...new Set(propertyNames)]; // de-duplicate
};

module.exports = getPropertyNamesForSchema;
