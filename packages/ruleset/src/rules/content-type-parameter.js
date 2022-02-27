const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { disallowedHeaderParameter } = require('../functions');
const { parameters } = require('../collections');

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
