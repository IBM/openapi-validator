const arrayOfArrays = require('./array-of-arrays');
const checkMajorVersion = require('./check-major-version');
const descriptionMentionsJSON = require('./description-mentions-json');
const discriminator = require('./discriminator');
const errorResponseSchema = require('./error-response-schema');
const propertyCaseCollision = require('./property-case-collision');
const propertyCaseConvention = require('./property-case-convention');
const requiredProperty = require('./required-property');
const responseExampleProvided = require('./response-example-provided');
const schemaDescription = require('./schema-description.js');
const schemaOrContentProvided = require('./schema-or-content-provided');
const stringBoundary = require('./string-boundary');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  arrayOfArrays,
  checkMajorVersion,
  descriptionMentionsJSON,
  discriminator,
  errorResponseSchema,
  propertyCaseCollision,
  propertyCaseConvention,
  requiredProperty,
  responseExampleProvided,
  schemaDescription,
  schemaOrContentProvided,
  stringBoundary,
  validTypeFormat
};
