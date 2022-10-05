const { oas3 } = require('@stoplight/spectral-formats');
const { composedSchemaRestrictions } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description:
    'Composed schemas using oneOf or anyOf should comply with SDK generation best practices',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: composedSchemaRestrictions
  }
};
