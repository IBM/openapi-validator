const {
  paths
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { duplicatePathParameter } = require('../functions');

module.exports = {
  description: 'Common path parameters should be defined on the path object.',
  given: paths,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: duplicatePathParameter
  }
};
