const arrayOfArrays = require('./array-of-arrays');
const checkMajorVersion = require('./check-major-version');
const descriptionMentionsJSON = require('./description-mentions-json');
const disallowedHeaderParameter = require('./disallowed-header-parameter');
const discriminator = require('./discriminator');
const enumCaseConvention = require('./enum-case-convention');
const errorResponseSchema = require('./error-response-schema');
const parameterDefault = require('./parameter-default');
const parameterDescription = require('./parameter-description');
const propertyCaseCollision = require('./property-case-collision');
const propertyCaseConvention = require('./property-case-convention');
const propertyDescription = require('./property-description');
const requiredProperty = require('./required-property');
const responseExampleProvided = require('./response-example-provided');
const schemaDescription = require('./schema-description.js');
const schemaOrContentProvided = require('./schema-or-content-provided');
const stringBoundary = require('./string-boundary');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  arrayOfArrays,
  disallowedHeaderParameter,
  checkMajorVersion,
  descriptionMentionsJSON,
  discriminator,
  enumCaseConvention,
  errorResponseSchema,
  parameterDefault,
  parameterDescription,
  propertyCaseCollision,
  propertyCaseConvention,
  propertyDescription,
  requiredProperty,
  responseExampleProvided,
  schemaDescription,
  schemaOrContentProvided,
  stringBoundary,
  validTypeFormat
};
