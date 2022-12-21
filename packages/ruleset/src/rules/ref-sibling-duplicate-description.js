const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { refSiblingDuplicateDescription } = require('../functions');

module.exports = {
  description:
    'Schemas and schema properties should avoid duplicate descriptions within allOf $ref siblings',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: refSiblingDuplicateDescription
  }
};
