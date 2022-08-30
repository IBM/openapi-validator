const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { collectionArrayProperty } = require('../functions');

module.exports = {
  description:
    'Collection list operation response schema should define array property whose name matches the final path segment of the operation path',
  message: '{{error}}',
  given:
    '$.paths[*].get.responses[?(@property.match(/2\\d\\d/))].content[*].schema',
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: collectionArrayProperty
  }
};
