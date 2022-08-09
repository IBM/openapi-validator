const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { noEtagHeader } = require('../functions');
const { paths } = require('../collections');

module.exports = {
  description:
    'ETag response header should be defined in GET operation for resources that support If-Match or If-None-Match header parameters',
  message: '{{error}}',
  given: paths,
  severity: 'error',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: noEtagHeader
  }
};
