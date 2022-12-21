const {
  parameters
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { parameterDescription } = require('../functions');

module.exports = {
  description: 'Parameters should have a non-empty description',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: parameterDescription
  }
};
