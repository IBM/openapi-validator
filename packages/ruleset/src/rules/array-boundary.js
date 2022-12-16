const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { arrayBoundary } = require('../functions');

module.exports = {
  description: 'Array schemas should have explicit boundaries defined',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: arrayBoundary
  }
};
