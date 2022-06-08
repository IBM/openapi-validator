const { oas3 } = require('@stoplight/spectral-formats');
const { refSiblingDuplicateDescription } = require('../functions');
const { schemas } = require('../collections');

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
