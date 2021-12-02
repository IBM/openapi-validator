const checkMajorVersion = require('./check-major-version');
const errorResponseSchema = require('./error-response-schema');
const requiredProperty = require('./required-property');
const responseExampleProvided = require('./response-example-provided');
const schemaOrContentProvided = require('./schema-or-content-provided');
const stringBoundary = require('./string-boundary');

module.exports = {
  checkMajorVersion,
  errorResponseSchema,
  requiredProperty,
  responseExampleProvided,
  schemaOrContentProvided,
  stringBoundary
};
