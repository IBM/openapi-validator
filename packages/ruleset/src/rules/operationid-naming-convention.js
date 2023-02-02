const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { operationIdNamingConvention } = require('../functions');

module.exports = {
  description: 'Operation ids should follow naming convention',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: operationIdNamingConvention
  }
};
