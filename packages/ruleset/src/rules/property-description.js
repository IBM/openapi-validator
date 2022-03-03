const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyDescription } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Schema properties should have a non-empty description',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: propertyDescription
  }
};
