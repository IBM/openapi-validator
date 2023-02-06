module.exports = {
  arrayAttributes: require('./array-attributes'),
  arrayOfArrays: require('./array-of-arrays'),
  arrayResponses: require('./array-responses'),
  binarySchemas: require('./binary-schemas'),
  checkMajorVersion: require('./check-major-version'),
  circularRefs: require('./circular-refs'),
  collectionArrayProperty: require('./collection-array-property'),
  consecutivePathParamSegments: require('./consecutive-path-param-segments'),
  deleteBody: require('./delete-body'),
  descriptionMentionsJSON: require('./description-mentions-json'),
  disallowedHeaderParameter: require('./disallowed-header-parameter'),
  discriminator: require('./discriminator'),
  duplicatePathParameter: require('./duplicate-path-parameter'),
  enumCaseConvention: require('./enum-case-convention'),
  errorResponseSchema: require('./error-response-schema'),
  ...require('./inline-schema-rules'),
  mergePatchOptionalProperties: require('./merge-patch-optional-properties'),
  noEtagHeader: require('./no-etag-header'),
  operationIdCaseConvention: require('./operation-id-case-convention'),
  operationIdNamingConvention: require('./operation-id-naming-convention'),
  operationSummary: require('./operation-summary'),
  optionalRequestBody: require('./optional-request-body'),
  paginationStyle: require('./pagination-style'),
  parameterCaseConvention: require('./parameter-case-convention'),
  parameterDefault: require('./parameter-default'),
  parameterDescription: require('./parameter-description'),
  parameterOrder: require('./parameter-order'),
  patchRequestContentType: require('./patch-request-content-type'),
  pathParamNotCRN: require('./path-param-not-crn'),
  pathSegmentCaseConvention: require('./path-segment-case-convention'),
  preconditionHeader: require('./precondition-header'),
  propertyAttributes: require('./property-attributes'),
  propertyCaseCollision: require('./property-case-collision'),
  propertyCaseConvention: require('./property-case-convention'),
  propertyDescription: require('./property-description'),
  propertyInconsistentNameAndType: require('./property-inconsistent-name-and-type'),
  refPattern: require('./ref-pattern'),
  refSiblingDuplicateDescription: require('./ref-sibling-duplicate-description'),
  requestBodyName: require('./request-body-name'),
  requiredProperty: require('./required-property'),
  responseExampleProvided: require('./response-example-provided'),
  responseStatusCodes: require('./response-status-codes'),
  schemaDescription: require('./schema-description'),
  schemaType: require('./schema-type'),
  schemaOrContentProvided: require('./schema-or-content-provided'),
  securitySchemeAttributes: require('./security-scheme-attributes'),
  securitySchemes: require('./security-schemes').securitySchemes,
  stringAttributes: require('./string-attributes'),
  unusedTag: require('./unused-tag').unusedTag,
  validatePathSegments: require('./valid-path-segments'),
  validTypeFormat: require('./valid-type-format')
};
