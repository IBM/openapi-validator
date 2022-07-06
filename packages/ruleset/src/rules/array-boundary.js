const { oas3 } = require('@stoplight/spectral-formats');
const { arrayBoundary } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Array schemas should have explicit boundaries defined',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: arrayBoundary
  }
};
