const { oas3 } = require('@stoplight/spectral-formats');
const { arrayBoundary } = require('../functions');

module.exports = {
  description: 'Array schemas should have explicit boundaries defined',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: [
    '$.paths[*][parameters][*].schema',
    '$.paths[*][parameters][*].content[*].schema',
    '$.paths[*][*][parameters][*].schema',
    '$.paths[*][*][parameters][*].content[*].schema',
    '$.paths[*][*].requestBody.content[*].schema',
  ],
  then: {
    function: arrayBoundary
  }
};
