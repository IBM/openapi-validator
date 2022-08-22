const { oas3 } = require('@stoplight/spectral-formats');
const { preconditionHeader } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description:
    'Operations with `412` response must support at least one conditional header.',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'error',
  resolved: true,
  then: {
    function: preconditionHeader
  }
};
