const { oas3 } = require('@stoplight/spectral-formats');
const { propertyAttributes } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description:
    'Performs checks on specific attributes of a schema or schema property',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: propertyAttributes
  }
};
