const {
  unresolvedRequestBodySchemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { inlineRequestSchema } = require('../functions');

module.exports = {
  description:
    'Request body schemas should be defined as a $ref to a named schema',
  message: '{{error}}',
  formats: [oas3],
  given: unresolvedRequestBodySchemas,
  severity: 'warn',
  resolved: false,
  then: {
    function: inlineRequestSchema
  }
};
