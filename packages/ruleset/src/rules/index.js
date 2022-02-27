const acceptParameter = require('./accept-parameter');
const arrayOfArrays = require('./array-of-arrays');
const authorizationParameter = require('./authorization-parameter');
const contentEntryContainsSchema = require('./content-entry-contains-schema');
const contentEntryProvided = require('./content-entry-provided');
const contentTypeParameter = require('./content-type-parameter');
const descriptionMentionsJSON = require('./description-mentions-json');
const discriminator = require('./discriminator');
const examplesNameContainsSpace = require('./examples-name-contains-space');
const ibmContentTypeIsSpecific = require('./ibm-content-type-is-specific');
const ibmErrorContentTypeIsJson = require('./ibm-error-content-type-is-json');
const ibmSdkOperations = require('./ibm-sdk-operations');
const majorVersionInPath = require('./major-version-in-path');
const missingRequiredProperty = require('./missing-required-property');
const parameterDefault = require('./parameter-default');
const parameterDescription = require('./parameter-description');
const parameterSchemaOrContent = require('./parameter-schema-or-content');
const prohibitSummarySentenceStyle = require('./prohibit-summary-sentence-style');
const propertyCaseCollision = require('./property-case-collision');
const propertyCaseConvention = require('./property-case-convention');
const propertyDescription = require('./property-description');
const requestBodyObject = require('./request-body-object');
const responseErrorResponseSchema = require('./response-error-response-schema');
const responseExampleProvided = require('./response-example-provided');
const schemaDescription = require('./schema-description');
const serverVariableDefaultValue = require('./server-variable-default-value');
const stringBoundary = require('./string-boundary');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  acceptParameter,
  arrayOfArrays,
  authorizationParameter,
  contentEntryContainsSchema,
  contentEntryProvided,
  contentTypeParameter,
  descriptionMentionsJSON,
  discriminator,
  examplesNameContainsSpace,
  ibmContentTypeIsSpecific,
  ibmErrorContentTypeIsJson,
  ibmSdkOperations,
  majorVersionInPath,
  missingRequiredProperty,
  parameterDefault,
  parameterDescription,
  parameterSchemaOrContent,
  prohibitSummarySentenceStyle,
  propertyCaseCollision,
  propertyCaseConvention,
  propertyDescription,
  requestBodyObject,
  responseErrorResponseSchema,
  responseExampleProvided,
  schemaDescription,
  serverVariableDefaultValue,
  stringBoundary,
  validTypeFormat
};
