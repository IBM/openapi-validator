const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { arrayOfArrays } = require('../functions');

module.exports = {
  description: 'Array schema with items of type array should be avoided',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayOfArrays
  }
};
