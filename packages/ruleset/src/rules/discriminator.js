const { oas3 } = require('@stoplight/spectral-formats');
const { discriminator } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'The discriminator property name must be defined in this schema',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: discriminator
  }
};
