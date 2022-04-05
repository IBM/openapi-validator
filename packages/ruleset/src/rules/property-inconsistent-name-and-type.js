const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyInconsistentNameAndType } = require('../functions');
const { schemas } = require('../collections');

// We need to look at properties across the entire API definition.
// This will act as a global variable to hold all of the properties
// as we visit elements in the "given" list.
const visitedProperties = {};

module.exports = {
  description:
    'Avoid using the same property name for properties of different types.',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'warn',
  resolved: true,
  then: {
    function: propertyInconsistentNameAndType,
    functionOptions: {
      visitedProperties,
      excludedProperties: ['code', 'default', 'type', 'value']
    }
  }
};
