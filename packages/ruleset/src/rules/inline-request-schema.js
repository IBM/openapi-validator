const { oas3 } = require('@stoplight/spectral-formats');
const { inlineRequestSchema } = require('../functions');
const { unresolvedRequestBodySchemas } = require('../collections');

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
