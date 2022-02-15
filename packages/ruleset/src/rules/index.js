const arrayOfArrays = require('./array-of-arrays');
const contentEntryContainsSchema = require('./content-entry-contains-schema');
const contentEntryProvided = require('./content-entry-provided');
const descriptionMentionsJSON = require('./description-mentions-json');
const discriminator = require('./discriminator');
const examplesNameContainsSpace = require('./examples-name-contains-space');
const ibmContentTypeIsSpecific = require('./ibm-content-type-is-specific');
const ibmErrorContentTypeIsJson = require('./ibm-error-content-type-is-json');
const ibmSdkOperations = require('./ibm-sdk-operations');
const majorVersionInPath = require('./major-version-in-path');
const missingRequiredProperty = require('./missing-required-property');
const parameterSchemaOrContent = require('./parameter-schema-or-content');
const prohibitSummarySentenceStyle = require('./prohibit-summary-sentence-style');
const propertyCaseCollision = require('./property-case-collision');
const requestBodyObject = require('./request-body-object');
const responseErrorResponseSchema = require('./response-error-response-schema');
const responseExampleProvided = require('./response-example-provided');
const schemaDescription = require('./schema-description');
const serverVariableDefaultValue = require('./server-variable-default-value');
const stringBoundary = require('./string-boundary');
const validTypeFormat = require('./valid-type-format');

module.exports = {
  arrayOfArrays,
  contentEntryContainsSchema,
  contentEntryProvided,
  descriptionMentionsJSON,
  discriminator,
  examplesNameContainsSpace,
  ibmContentTypeIsSpecific,
  ibmErrorContentTypeIsJson,
  ibmSdkOperations,
  majorVersionInPath,
  missingRequiredProperty,
  parameterSchemaOrContent,
  prohibitSummarySentenceStyle,
  propertyCaseCollision,
  requestBodyObject,
  responseErrorResponseSchema,
  responseExampleProvided,
  schemaDescription,
  serverVariableDefaultValue,
  stringBoundary,
  validTypeFormat
};
