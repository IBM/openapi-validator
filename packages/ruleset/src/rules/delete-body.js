const {
  operations
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { deleteBody } = require('../functions');

module.exports = {
  description: 'Delete operations should not contain a requestBody.',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: operations,
  then: {
    function: deleteBody
  }
};
