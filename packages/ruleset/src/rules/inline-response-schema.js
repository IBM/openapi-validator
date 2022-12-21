const {
  unresolvedResponseSchemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { inlineResponseSchema } = require('../functions');

module.exports = {
  description: 'Response schemas should be defined as a $ref to a named schema',
  message: '{{error}}',
  formats: [oas3],
  given: unresolvedResponseSchemas,
  severity: 'warn',
  resolved: false,
  then: {
    function: inlineResponseSchema
  }
};
