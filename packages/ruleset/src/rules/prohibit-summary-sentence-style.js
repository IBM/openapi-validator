const { oas3 } = require('@stoplight/spectral-formats');
const { pattern } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Summary should not have a trailing period',
  severity: 'warn',
  formats: [oas3],
  resolved: false,
  given: '$.paths[*][*].summary',
  then: {
    function: pattern,
    functionOptions: {
      notMatch: '\\.$'
    }
  }
};
