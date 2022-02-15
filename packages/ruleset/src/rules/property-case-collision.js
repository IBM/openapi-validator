const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyCaseCollision } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Property names should not be identical',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'error',
  resolved: true,
  then: {
    function: propertyCaseCollision
  }
};
