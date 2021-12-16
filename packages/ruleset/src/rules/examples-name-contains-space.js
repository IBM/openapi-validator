const { pattern } = require('@stoplight/spectral-functions');
const { oas3 } = require('@stoplight/spectral-formats');

module.exports = {
  description: 'Examples name should not contain space',
  message: '{{description}}',
  severity: 'warn',
  resolved: false,
  formats: [oas3],
  given: '$.paths[*][*].responses[*][*][*].examples[*]~',
  then: {
    function: pattern,
    functionOptions: {
      notMatch: '^(.*\\s+.*)+$'
    }
  }
};
