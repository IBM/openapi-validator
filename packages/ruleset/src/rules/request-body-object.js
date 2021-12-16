const { enumeration } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'All request bodies MUST be structured as an object',
  given: '$.paths[*][*].requestBody.content[*].schema',
  severity: 'error',
  then: {
    field: 'type',
    function: enumeration,
    functionOptions: {
      values: ['object']
    }
  }
};
