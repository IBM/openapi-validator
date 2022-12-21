const {
  schemas
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { propertyCaseCollision } = require('../functions');

module.exports = {
  description:
    'Avoid duplicate property names within a schema, even if they differ by case convention',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: schemas,
  severity: 'error',
  resolved: true,
  then: {
    function: propertyCaseCollision
  }
};
