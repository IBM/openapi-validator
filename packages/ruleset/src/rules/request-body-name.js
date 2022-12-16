const {
  operations
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { requestBodyName } = require('../functions');

module.exports = {
  description:
    'Verify that operations have the x-codegen-request-body-name extension set when needed',
  message: '{{error}}',
  given: operations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: requestBodyName
  }
};
