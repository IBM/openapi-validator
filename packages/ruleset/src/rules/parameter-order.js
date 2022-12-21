const {
  operations
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { parameterOrder } = require('../functions');

module.exports = {
  description:
    'All required operation parameters should be listed before any optional parameters.',
  message: '{{error}}',
  given: operations,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: parameterOrder
  }
};
