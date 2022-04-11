const { oas3 } = require('@stoplight/spectral-formats');
const { operationSummary } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description: 'Operation "summary" must be present and non-empty string.',
  given: operations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: operationSummary
  }
};
