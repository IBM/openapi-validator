const { enumeration } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'All request bodies MUST be structured as an object',
  given:
    '$.paths[*][*].requestBody.content.[?(@property ~= "^application\\\\/json(;.*)*$")].schema',
  severity: 'error',
  then: {
    field: 'type',
    function: enumeration,
    functionOptions: {
      values: ['object']
    }
  }
};
