const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { pathSegmentCaseConvention } = require('../functions');
const { paths } = require('../collections');

module.exports = {
  description: 'Path segments must follow a specified case convention',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: paths,
  severity: 'error',
  then: {
    function: pathSegmentCaseConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
