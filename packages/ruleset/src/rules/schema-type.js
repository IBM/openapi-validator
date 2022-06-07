const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { schemaType } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description:
    'Schemas and schema properties should have a non-empty `type` field. **This rule is disabled by default.**',
  message: '{{error}}',
  given: schemas,
  severity: 'off',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: schemaType
  }
};
