const isObject = require('./is-object');

/**
 * Returns an array of property names for a composite schema,
 * optionally filtered by a lambda function.
 */
const getPropertyNamesForSchema = (schema, propertyFilter = () => true) => {
  const propertyNames = [];

  if (!isObject(schema)) {
    return propertyNames;
  }

  if (isObject(schema.properties)) {
    for (const propertyName of Object.keys(schema.properties)) {
      if (propertyFilter(propertyName, schema.properties[propertyName])) {
        propertyNames.push(propertyName);
      }
    }
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      for (const applicatorSchema of schema[applicatorType]) {
        propertyNames.push(
          ...getPropertyNamesForSchema(applicatorSchema, propertyFilter)
        );
      }
    }
  }

  return [...new Set(propertyNames)]; // de-duplicate
};

module.exports = getPropertyNamesForSchema;
