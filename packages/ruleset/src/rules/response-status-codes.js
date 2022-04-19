const { oas3 } = require('@stoplight/spectral-formats');
const { responseStatusCodes } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description:
    'Performs multiple checks on the status codes used in operation responses.',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'warn',
  resolved: true,
  then: {
    function: responseStatusCodes
  }
};
