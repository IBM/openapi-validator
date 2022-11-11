const getAllComposedSchemas = require('./get-all-composed-schemas');
const isObject = require('./is-object');

/**
 * Returns a dictionary object of property schemas in arrays keyed by property name for a simple or
 * composite schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object
 * @returns {object} - Dictionary mapping property name to collected schemas[]
 */
const getPropertySchemasByName = schema => {
  const dictionary = {};
  const schemas = getAllComposedSchemas(schema);

  for (const s of schemas) {
    if (isObject(s.properties)) {
      for (const propertyName of Object.keys(s.properties)) {
        if (!Array.isArray(dictionary[propertyName])) {
          dictionary[propertyName] = [];
        }
        dictionary[propertyName].push(s.properties[propertyName]);
      }
    }
  }

  return dictionary;
};

module.exports = getPropertySchemasByName;
