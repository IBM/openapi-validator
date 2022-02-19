const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { enumCaseConvention } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Enum values must follow a specified case convention',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: enumCaseConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
