const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { checkMajorVersion } = require('../functions');

module.exports = {
  description:
    'All paths must contain the API major version as a distinct path segment',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: '$',
  severity: 'warn',
  then: {
    function: checkMajorVersion
  }
};
