const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { arrayItems } = require('../functions');

module.exports = {
  description: 'Array schemas must have "items" field',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayItems
  }
};
