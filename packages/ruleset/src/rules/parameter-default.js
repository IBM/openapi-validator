const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { parameterDefault } = require('../functions');
const { parameters } = require('../collections');

module.exports = {
  description: 'Required parameters should not define a default value',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: parameterDefault
  }
};
