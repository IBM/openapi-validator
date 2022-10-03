const { oas3 } = require('@stoplight/spectral-formats');
const { composedSchemaRestrictions } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description:
    'Composed schemas using oneOf or anyOf should comply with restrictions imposed by the SDK generator',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: composedSchemaRestrictions
  }
};
