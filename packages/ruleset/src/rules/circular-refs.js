const { oas3 } = require('@stoplight/spectral-formats');
const { circularRefs } = require('../functions');

module.exports = {
  description: 'API definition should not contain circular references.',
  message: '{{error}}',
  given: '$..$ref',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: circularRefs
  }
};
