const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { requiredProperty } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'A required property is not in the schema',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: requiredProperty
  }
};
