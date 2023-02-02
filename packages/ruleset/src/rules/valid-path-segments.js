const {
  paths
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { validatePathSegments } = require('../functions');

module.exports = {
  description: 'Validates individual path segments within a path string',
  message: '{{error}}',
  formats: [oas3],
  given: paths,
  severity: 'error',
  resolved: true,
  then: {
    function: validatePathSegments
  }
};
