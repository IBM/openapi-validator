const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyInconsistentNameAndType } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description:
    'Avoid using the same property name for properties of different types.',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'off',
  resolved: true,
  then: {
    function: propertyInconsistentNameAndType,
    functionOptions: {
      excludedProperties: ['code', 'default', 'type', 'value']
    }
  }
};
