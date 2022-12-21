const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { schemaDescription } = require('../functions');

module.exports = {
  description:
    'Schemas and schema properties should have a non-empty description',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: schemaDescription
  }
};
