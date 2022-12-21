const {
  paths
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { consecutivePathParamSegments } = require('../functions');

module.exports = {
  description:
    'Path strings should not contain two or more consecutive path parameter references',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: paths,
  severity: 'error',
  resolved: true,
  then: {
    function: consecutivePathParamSegments
  }
};
