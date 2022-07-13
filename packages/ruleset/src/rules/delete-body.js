const { oas3 } = require('@stoplight/spectral-formats');
const { deleteBody } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description: '"delete" operation should not contain a requestBody.',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: operations,
  then: {
    function: deleteBody
  }
};
