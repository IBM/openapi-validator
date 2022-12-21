const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyDescription } = require('../functions');

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
