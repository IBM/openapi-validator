const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { descriptionMentionsJSON } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Schema descriptions should avoid mentioning "JSON"',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: descriptionMentionsJSON
  }
};
