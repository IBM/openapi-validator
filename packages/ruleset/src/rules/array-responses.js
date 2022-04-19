const { oas3 } = require('@stoplight/spectral-formats');
const { arrayResponses } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description:
    'Operations should not return an array as the top-level structure of a response.',
  message: '{{error}}',
  given: operations,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayResponses
  }
};
