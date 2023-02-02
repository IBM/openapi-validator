const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { propertyCasingConvention } = require('../functions');

module.exports = {
  description: 'Property names must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: propertyCasingConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
