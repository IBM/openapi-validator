const { oas3 } = require('@stoplight/spectral-formats');
const { securitySchemeAttributes } = require('../functions');
const { securitySchemes } = require('../collections');

module.exports = {
  description:
    'Validates the attributes of security schemes within an OpenAPI 3 document',
  message: '{{error}}',
  given: securitySchemes,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: securitySchemeAttributes
  }
};
