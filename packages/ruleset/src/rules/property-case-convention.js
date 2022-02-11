const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyCaseConvention } = require('../functions');
const { schemas } = require('../collections');

module.exports = {
  description: 'Property names must follow a specified case convention',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: propertyCaseConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
