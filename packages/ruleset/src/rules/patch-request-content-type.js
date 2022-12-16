const {
  patchOperations
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { patchRequestContentType } = require('../functions');

module.exports = {
  description:
    'PATCH requests should support content types "application/json-patch+json" or "application/merge-patch+json"',
  message: '{{description}}',
  given: patchOperations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: patchRequestContentType
  }
};
