const isObject = require('./is-object');

/**
 * Returns a dictionary object of property schemas in arrays keyed by property name for a simple or
 * composite schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {object} - Dictionary mapping property name to collected schemas[]
 */
const getPropertySchemasByName = schema => {
  let propertyDictionary = {};

  if (!isObject(schema)) {
    return propertyDictionary;
  }

  if (isObject(schema.properties)) {
    for (const propertyName of Object.keys(schema.properties)) {
      propertyDictionary[propertyName] = [schema.properties[propertyName]];
    }
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      for (const applicatorSchema of schema[applicatorType]) {
        propertyDictionary = mergeDictionaries(
          propertyDictionary,
          getPropertySchemasByName(applicatorSchema)
        );
      }
    }
  }

  return propertyDictionary;
};

function mergeDictionaries(...dictionaries) {
  const newDictionary = {};

  for (const dictionary of dictionaries) {
    for (const propertyName of Object.keys(dictionary)) {
      if (!Array.isArray(newDictionary[propertyName])) {
        newDictionary[propertyName] = [];
      }
      newDictionary[propertyName].push(...dictionary[propertyName]);
    }
  }

  return newDictionary;
}

module.exports = getPropertySchemasByName;
