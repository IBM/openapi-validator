const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { enumCaseConvention } = require('../functions');

module.exports = {
  description: 'Enum values must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: enumCaseConvention,
    functionOptions: {
      type: 'snake'
    }
  }
};
