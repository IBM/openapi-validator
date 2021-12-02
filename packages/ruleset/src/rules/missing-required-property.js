const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { requiredProperty } = require('../functions');

module.exports = {
  description: 'A required property is not in the schema',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: [
    '$.paths[*][*][parameters][*].schema',
    '$.paths[*][*][parameters,responses][*].content[*].schema',
    '$.paths[*][*][requestBody].content[*].schema'
  ],
  severity: 'error',
  then: {
    function: requiredProperty
  }
};
