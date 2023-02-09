const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { descriptionMentionsJSON } = require('../functions');

module.exports = {
  description: 'Schema descriptions should avoid mentioning "JSON"',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: descriptionMentionsJSON
  }
};
