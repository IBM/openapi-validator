const { oas3 } = require('@stoplight/spectral-formats');
const { schemaOrContentProvided } = require('../functions');

module.exports = {
  description: 'Parameter must provide either a schema or content',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  given: '$.paths[*][*].parameters[*]',
  then: {
    function: schemaOrContentProvided
  }
};
