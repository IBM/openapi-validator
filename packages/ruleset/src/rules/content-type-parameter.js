const {
  parameters
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { disallowedHeaderParameter } = require('../functions');

module.exports = {
  description:
    "Operations should not explicitly define the 'Content-Type' header parameter",
  message: '{{description}}',
  formats: [oas2, oas3],
  given: parameters,
  severity: 'warn',
  then: {
    function: disallowedHeaderParameter,
    functionOptions: {
      headerName: 'Content-Type'
    }
  }
};
