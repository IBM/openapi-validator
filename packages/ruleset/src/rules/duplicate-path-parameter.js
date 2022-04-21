const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { duplicatePathParameter } = require('../functions');
const { paths } = require('../collections');

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
