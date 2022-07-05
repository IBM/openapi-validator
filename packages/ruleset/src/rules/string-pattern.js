const { oas3 } = require('@stoplight/spectral-formats');
const { stringPattern } = require('../functions');

module.exports = {
  description: 'String schemas should have pattern defined',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: [
    '$.paths[*][parameters][*].schema',
    '$.paths[*][parameters][*].content[*].schema',
    '$.paths[*][*][parameters][*].schema',
    '$.paths[*][*][parameters][*].content[*].schema',
    '$.paths[*][*].requestBody.content[*].schema'
  ],
  then: {
    function: stringPattern
  }
};
