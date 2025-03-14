/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  acceptAndReturnModels: require('./accept-and-return-models'),
  acceptHeader: require('./accept-header'),
  anchoredPatterns: require('./anchored-patterns'),
  apiSymmetry: require('./api-symmetry'),
  arrayAttributes: require('./array-attributes'),
  arrayOfArrays: require('./array-of-arrays'),
  arrayResponses: require('./array-responses'),
  authorizationHeader: require('./authorization-header'),
  avoidMultipleTypes: require('./avoid-multiple-types'),
  binarySchemas: require('./binary-schemas'),
  circularRefs: require('./circular-refs'),
  collectionArrayProperty: require('./collection-array-property'),
  consecutivePathSegments: require('./consecutive-path-segments'),
  contentContainsSchema: require('./content-contains-schema'),
  contentTypeHeader: require('./content-type-header'),
  contentTypeIsSpecific: require('./content-type-is-specific'),
  deleteBody: require('./delete-body'),
  discriminatorPropertyExists: require('./discriminator-property-exists'),
  duplicatePathParameter: require('./duplicate-path-parameter'),
  etagHeaderExists: require('./etag-header-exists'),
  enumCasingConvention: require('./enum-casing-convention'),
  errorContentTypeIsJson: require('./error-content-type-is-json'),
  errorResponseSchemas: require('./error-response-schemas'),
  examplesNameContainsSpace: require('./examples-name-contains-space'),
  ibmSdkOperations: require('./ibm-sdk-operations'),
  ifModifiedSinceHeader: require('./if-modified-since-header'),
  ifUnmodifiedSinceHeader: require('./if-unmodified-since-header'),
  inlineSchemas: require('./inline-schemas'),
  integerAttributes: require('./integer-attributes'),
  majorVersionInPath: require('./major-version-in-path'),
  mergePatchProperties: require('./merge-patch-properties'),
  noAmbiguousPaths: require('./no-ambiguous-paths'),
  noNullableProperties: require('./no-nullable-properties'),
  noOperationRequestBody: require('./no-operation-requestbody'),
  noRefInExample: require('./no-ref-in-example'),
  noSuperfluousAllOf: require('./no-superfluous-allof'),
  noUnsupportedKeywords: require('./no-unsupported-keywords'),
  operationIdCasingConvention: require('./operationid-casing-convention'),
  operationIdNamingConvention: require('./operationid-naming-convention'),
  operationResponses: require('./operation-responses'),
  operationSummaryExists: require('./operation-summary-exists'),
  operationSummaryLength: require('./operation-summary-length'),
  optionalRequestBody: require('./optional-request-body'),
  optionalRequestBodyDeprecated: require('./optional-request-body-deprecated'),
  paginationStyle: require('./pagination-style'),
  parameterCasingConvention: require('./parameter-casing-convention'),
  parameterDefault: require('./parameter-default'),
  parameterDescriptionExists: require('./parameter-description-exists'),
  parameterOrder: require('./parameter-order'),
  parameterSchemaOrContentExists: require('./parameter-schema-or-content-exists'),
  patchRequestContentType: require('./patch-request-content-type'),
  pathParameterNotCRN: require('./path-parameter-not-crn'),
  pathSegmentCasingConvention: require('./path-segment-casing-convention'),
  patternProperties: require('./pattern-properties'),
  preconditionHeader: require('./precondition-header'),
  preferTokenPagination: require('./prefer-token-pagination'),
  propertyAttributes: require('./property-attributes'),
  propertyCasingConvention: require('./property-casing-convention'),
  propertyConsistentNameAndType: require('./property-consistent-name-and-type'),
  propertyDescriptionExists: require('./property-description-exists'),
  propertyNameCollision: require('./property-name-collision'),
  refPattern: require('./ref-pattern'),
  refSiblingDuplicateDescription: require('./ref-sibling-duplicate-description'),
  requestAndResponseContent: require('./request-and-response-content'),
  requestBodyIsObject: require('./requestbody-is-object'),
  requestBodyName: require('./requestbody-name'),
  requiredArrayPropertiesInResponse: require('./required-array-properties-in-response'),
  requiredEnumPropertiesInResponse: require('./required-enum-properties-in-response'),
  requiredPropertyMissing: require('./required-property-missing'),
  resourceResponseConsistency: require('./resource-response-consistency'),
  responseExampleExists: require('./response-example-exists'),
  responseStatusCodes: require('./response-status-codes'),
  schemaCasingConvention: require('./schema-casing-convention'),
  schemaDescriptionExists: require('./schema-description-exists'),
  schemaKeywords: require('./schema-keywords'),
  schemaNamingConvention: require('./schema-naming-convention'),
  schemaTypeExists: require('./schema-type-exists'),
  schemaTypeFormat: require('./schema-type-format'),
  securitySchemes: require('./securityschemes'),
  securitySchemeAttributes: require('./securityscheme-attributes'),
  serverVariableDefaultValue: require('./server-variable-default-value'),
  stringAttributes: require('./string-attributes'),
  summarySentenceStyle: require('./summary-sentence-style'),
  typedEnum: require('./typed-enum'),
  unevaluatedProperties: require('./unevaluated-properties'),
  unusedTags: require('./unused-tags'),
  uniqueParameterRequestPropertyNames: require('./unique-parameter-request-property-names'),
  useDateBasedFormat: require('./use-date-based-format'),
  validPathSegments: require('./valid-path-segments'),
  validSchemaExample: require('./valid-schema-example'),
  wellDefinedDictionaries: require('./well-defined-dictionaries'),
};
