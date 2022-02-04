const checkMajorVersion = require('./check-major-version');
const discriminator = require('./discriminator');
const errorResponseSchema = require('./error-response-schema');
const requiredProperty = require('./required-property');
const responseExampleProvided = require('./response-example-provided');
const schemaOrContentProvided = require('./schema-or-content-provided');
const stringBoundary = require('./string-boundary');
const validTypeFormat = require('./valid-type-format');
const arrayOfArrays = require('./array-of-arrays');

module.exports = {
  checkMajorVersion,
  discriminator,
  errorResponseSchema,
  requiredProperty,
  responseExampleProvided,
  schemaOrContentProvided,
  stringBoundary,
  validTypeFormat,
  arrayOfArrays
};
