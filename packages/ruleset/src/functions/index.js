const arrayOfArrays = require('./array-of-arrays');
const arrayResponses = require('./array-responses');
const checkMajorVersion = require('./check-major-version');
const descriptionMentionsJSON = require('./description-mentions-json');
const disallowedHeaderParameter = require('./disallowed-header-parameter');
const discriminator = require('./discriminator');
const enumCaseConvention = require('./enum-case-convention');
const errorResponseSchema = require('./error-response-schema');
const operationIdCaseConvention = require('./operation-id-case-convention');
const operationIdNamingConvention = require('./operation-id-naming-convention');
const operationSummary = require('./operation-summary');
const paginationStyle = require('./pagination-style');
const parameterCaseConvention = require('./parameter-case-convention');
const parameterDefault = require('./parameter-default');
const parameterDescription = require('./parameter-description');
const parameterOrder = require('./parameter-order');
const propertyCaseCollision = require('./property-case-collision');
const propertyCaseConvention = require('./property-case-convention');
const propertyDescription = require('./property-description');
const propertyInconsistentNameAndType = require('./property-inconsistent-name-and-type');
const requestBodyName = require('./request-body-name');
const requiredProperty = require('./required-property');
const responseExampleProvided = require('./response-example-provided');
const schemaDescription = require('./schema-description.js');
const schemaOrContentProvided = require('./schema-or-content-provided');
const { securitySchemes } = require('./security-schemes');
const stringBoundary = require('./string-boundary');
const { unusedTag } = require('./unused-tag');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  arrayOfArrays,
  arrayResponses,
  disallowedHeaderParameter,
  checkMajorVersion,
  descriptionMentionsJSON,
  discriminator,
  enumCaseConvention,
  errorResponseSchema,
  operationIdCaseConvention,
  operationIdNamingConvention,
  operationSummary,
  paginationStyle,
  parameterCaseConvention,
  parameterDefault,
  parameterDescription,
  parameterOrder,
  propertyCaseCollision,
  propertyCaseConvention,
  propertyDescription,
  propertyInconsistentNameAndType,
  requestBodyName,
  requiredProperty,
  responseExampleProvided,
  schemaDescription,
  schemaOrContentProvided,
  stringBoundary,
  securitySchemes,
  unusedTag,
  validTypeFormat
};
