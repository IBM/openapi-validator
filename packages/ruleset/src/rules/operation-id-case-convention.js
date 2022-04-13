const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { operationIdCaseConvention } = require('../functions');
const { operations } = require('../collections');

module.exports = {
  description: 'Operation ids must follow a specified case convention',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: operations,
  severity: 'warn',
  then: {
    function: operationIdCaseConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
