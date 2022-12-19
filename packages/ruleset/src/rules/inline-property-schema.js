const {
  unresolvedSchemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { inlinePropertySchema } = require('../functions');

module.exports = {
  description: 'Nested objects should be defined as a $ref to a named schema',
  message: '{{error}}',
  formats: [oas3],
  given: unresolvedSchemas,
  severity: 'warn',
  resolved: false,
  then: {
    function: inlinePropertySchema
  }
};
