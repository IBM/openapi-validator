const { oas3 } = require('@stoplight/spectral-formats');
const { arrayOfArrays } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Array schema with items of type array should be avoided',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayOfArrays
  }
};
