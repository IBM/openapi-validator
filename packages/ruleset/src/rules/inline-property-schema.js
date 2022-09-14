const { oas3 } = require('@stoplight/spectral-formats');
const { inlinePropertySchema } = require('../functions');
const { unresolvedSchemas } = require('../collections');

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
