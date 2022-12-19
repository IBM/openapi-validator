const {
  parameters
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { disallowedHeaderParameter } = require('../functions');

module.exports = {
  description:
    'Operations should support the If-Match header parameter instead of If-Unmodified-Since',
  message: '{{description}}',
  formats: [oas2, oas3],
  given: parameters,
  severity: 'warn',
  resolved: true,
  then: {
    function: disallowedHeaderParameter,
    functionOptions: {
      headerName: 'If-Unmodified-Since'
    }
  }
};
