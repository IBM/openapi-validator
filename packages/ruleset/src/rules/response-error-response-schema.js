const { oas3 } = require('@stoplight/spectral-formats');
const { errorResponseSchema } = require('../functions');

module.exports = {
  description: 'Error response should follow design guidelines',
  message: '{{error}}',
  given:
    '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content[*].schema',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: errorResponseSchema
  }
};
