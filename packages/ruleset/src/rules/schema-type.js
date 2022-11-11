const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { schemaType } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Schemas must have an explicit and consistent type',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: schemaType
  }
};
