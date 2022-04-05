const { validateSubschemas } = require('../utils');

let visitedProperties;
let excludedProperties;

module.exports = function(schema, options, { path }) {
  visitedProperties = options.visitedProperties;
  excludedProperties = options.excludedProperties;
  return validateSubschemas(schema, path, propertyInconsistentNameAndType);
};

function propertyInconsistentNameAndType(schema, path) {
  if (schema.properties) {
    const errors = [];

    for (const [propName, prop] of Object.entries(schema.properties)) {
      // Skip check for deprecated properties.
      if (prop.deprecated === true) continue;

      if (visitedProperties[propName]) {
        if (visitedProperties[propName].type !== prop.type) {
          // First property that appeared in API def, should only flag once.
          if (!visitedProperties[propName].flagged) {
            visitedProperties[propName].flagged = true;
            errors.push({
              message: `Properties with the same name have inconsistent types: ${propName}.`,
              path: visitedProperties[propName].path
            });
          }
          // flag the rest of the properties that have the
          // same name but a different type as the first
          errors.push({
            message: `Properties with the same name have inconsistent types: ${propName}.`,
            path: [...path, 'properties', propName]
          });
        }
      } else {
        if (prop.type && !excludedProperties.includes(propName)) {
          // add property if the name is not excluded
          // and skip properties with an undefined type
          visitedProperties[propName] = {
            type: prop.type,
            path: [...path, 'properties', propName],
            flagged: false
          };
        }
      }
    }

    return errors;
  }

  return [];
}
