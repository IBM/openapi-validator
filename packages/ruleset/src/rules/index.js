const acceptParameter = require('./accept-parameter');
const arrayOfArrays = require('./array-of-arrays');
const arrayResponses = require('./array-responses');
const authorizationParameter = require('./authorization-parameter');
const contentEntryContainsSchema = require('./content-entry-contains-schema');
const contentEntryProvided = require('./content-entry-provided');
const contentTypeParameter = require('./content-type-parameter');
const descriptionMentionsJSON = require('./description-mentions-json');
const discriminator = require('./discriminator');
const duplicatePathParameter = require('./duplicate-path-parameter');
const enumCaseConvention = require('./enum-case-convention');
const examplesNameContainsSpace = require('./examples-name-contains-space');
const ibmContentTypeIsSpecific = require('./ibm-content-type-is-specific');
const ibmErrorContentTypeIsJson = require('./ibm-error-content-type-is-json');
const ibmSdkOperations = require('./ibm-sdk-operations');
const inlineResponseSchema = require('./inline-response-schema');
const majorVersionInPath = require('./major-version-in-path');
const missingRequiredProperty = require('./missing-required-property');
const operationIdCaseConvention = require('./operation-id-case-convention');
const operationIdNamingConvention = require('./operation-id-naming-convention');
const operationSummary = require('./operation-summary');
const paginationStyle = require('./pagination-style');
const parameterCaseConvention = require('./parameter-case-convention');
const parameterDefault = require('./parameter-default');
const parameterDescription = require('./parameter-description');
const parameterOrder = require('./parameter-order');
const parameterSchemaOrContent = require('./parameter-schema-or-content');
const pathSegmentCaseConvention = require('./path-segment-case-convention');
const prohibitSummarySentenceStyle = require('./prohibit-summary-sentence-style');
const propertyCaseCollision = require('./property-case-collision');
const propertyCaseConvention = require('./property-case-convention');
const propertyDescription = require('./property-description');
const propertyInconsistentNameAndType = require('./property-inconsistent-name-and-type');
const requestBodyName = require('./request-body-name');
const requestBodyObject = require('./request-body-object');
const responseErrorResponseSchema = require('./response-error-response-schema');
const responseExampleProvided = require('./response-example-provided');
const responseStatusCodes = require('./response-status-codes');
const schemaDescription = require('./schema-description');
const securitySchemes = require('./security-schemes');
const serverVariableDefaultValue = require('./server-variable-default-value');
const stringBoundary = require('./string-boundary');
const unusedTag = require('./unused-tag');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  acceptParameter,
  arrayOfArrays,
  arrayResponses,
  authorizationParameter,
  contentEntryContainsSchema,
  contentEntryProvided,
  contentTypeParameter,
  descriptionMentionsJSON,
  discriminator,
  duplicatePathParameter,
  enumCaseConvention,
  examplesNameContainsSpace,
  ibmContentTypeIsSpecific,
  ibmErrorContentTypeIsJson,
  ibmSdkOperations,
  inlineResponseSchema,
  majorVersionInPath,
  missingRequiredProperty,
  operationIdCaseConvention,
  operationIdNamingConvention,
  operationSummary,
  paginationStyle,
  parameterCaseConvention,
  parameterDefault,
  parameterDescription,
  parameterOrder,
  parameterSchemaOrContent,
  pathSegmentCaseConvention,
  prohibitSummarySentenceStyle,
  propertyCaseCollision,
  propertyCaseConvention,
  propertyDescription,
  propertyInconsistentNameAndType,
  requestBodyName,
  requestBodyObject,
  responseErrorResponseSchema,
  responseExampleProvided,
  responseStatusCodes,
  schemaDescription,
  securitySchemes,
  serverVariableDefaultValue,
  stringBoundary,
  unusedTag,
  validTypeFormat
};
