const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { validTypeFormat } = require('../functions');

module.exports = {
  description: 'Schema must use valid combination of type and format',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: validTypeFormat
  }
};
