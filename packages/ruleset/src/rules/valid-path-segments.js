const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { validatePathSegments } = require('../functions');
const { paths } = require('../collections');

module.exports = {
  description: 'Validates individual path segments within a path string',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: paths,
  severity: 'error',
  resolved: true,
  then: {
    function: validatePathSegments
  }
};
