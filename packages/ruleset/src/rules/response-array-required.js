const { oas3 } = require('@stoplight/spectral-formats');
const { responseArrayRequired } = require('../functions');
const { responseSchemas } = require('../collections');

module.exports = {
  description: 'Array properties in response schemas must be required',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  given: responseSchemas,
  then: {
    function: responseArrayRequired
  }
};
