const { oas3 } = require('@stoplight/spectral-formats');
const { oas } = require('@stoplight/spectral-rulesets');
const ibmRules = require('./rules');
module.exports = {
  extends: oas,
  documentationUrl:
    'https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md',
  formats: [oas3],
  rules: {
    // Original list created from Spectral with:
    // jq -r '.rules | to_entries | .[] | select(.value.recommended != false) | "  \(.key): off"' src/rulesets/oas/index.json

    // Spectral OAS rules - IBM Custom Settings

    // Turn off -- duplicates no_success_response_codes
    'operation-success-response': 'off',
    // Enable with same severity as Spectral
    'oas2-operation-formData-consume-check': true,
    // Enable with same severity as Spectral
    'operation-operationId-unique': true,
    // Enable with same severity as Spectral
    'operation-parameters': true,
    // Enable with same severity as Spectral
    'operation-tag-defined': true,
    // Turn off - exclude from ibm:oas
    'info-contact': 'off',
    // Turn off - exclude from ibm:oas
    'info-description': 'off',
    // Enable with same severity as Spectral
    'no-eval-in-markdown': true,
    // Enable with same severity as Spectral
    'no-script-tags-in-markdown': true,
    // Enable with same severity as Spectral
    'openapi-tags': true,
    // Enable with same severity as Spectral
    'operation-description': true,
    // Enable with same severity as Spectral
    'operation-operationId': true,
    // Turn off - duplicates operation_id_case_convention
    'operation-operationId-valid-in-url': 'off',
    // Enable with same severity as Spectral
    'operation-tags': true,
    // Enable with same severity as Spectral
    'path-params': true,
    // Enable with same severity as Spectral
    'path-declarations-must-exist': true,
    // Enable with same severity as Spectral
    'path-keys-no-trailing-slash': true,
    // Enable with same severity as Spectral
    'path-not-include-query': true,
    // Enable with same severity as Spectral
    'no-$ref-siblings': true,
    // Enable with same severity as Spectral
    'typed-enum': true,
    // Enable with same severity as Spectral
    'oas2-api-host': true,
    // Enable with same severity as Spectral
    'oas2-api-schemes': true,
    // Enable with same severity as Spectral
    'oas2-host-trailing-slash': true,
    // Turn off - dupicates non-configurable validation - security-ibm.js
    'oas2-operation-security-defined': 'off',
    // Enable with warn severity
    'oas2-valid-schema-example': 'warn',
    // Turn off
    'oas2-valid-media-example': 'off',
    // Enable with same severity as Spectral
    'oas2-anyOf': true,
    // Enable with same severity as Spectral
    'oas2-oneOf': true,
    // Turn off
    'oas2-schema': 'off',
    // Turn off - duplicates non-configurable validation in base validator
    'oas2-unused-definition': true,
    // Enable with same severity as Spectral
    'oas3-api-servers': true,
    // Enable with same severity as Spectral
    'oas3-examples-value-or-externalValue': true,
    // Turn off - dupicates non-configurable validation - security-ibm.js
    'oas3-operation-security-defined': 'off',
    // Enable with same severity as Spectral
    'oas3-server-trailing-slash': true,
    // Enable with warn severity
    'oas3-valid-media-example': 'warn',
    // Enable with warn severity
    'oas3-valid-schema-example': 'warn',
    // Enable with same severity as Spectral
    'oas3-schema': true,
    // Turn off - duplicates non-configurable validation in base validator
    'oas3-unused-component': true,

    // IBM Custom Rules
    'ibm-accept-parameter': ibmRules.acceptParameter,
    'ibm-array-attributes': ibmRules.arrayAttributes,
    'ibm-array-of-arrays': ibmRules.arrayOfArrays,
    'ibm-array-responses': ibmRules.arrayResponses,
    'ibm-authorization-parameter': ibmRules.authorizationParameter,
    'ibm-binary-schemas': ibmRules.binarySchemas,
    'ibm-circular-refs': ibmRules.circularRefs,
    'ibm-collection-array-property': ibmRules.collectionArrayProperty,
    'ibm-consecutive-path-segments': ibmRules.consecutivePathSegments,
    'ibm-content-contains-schema': ibmRules.contentContainsSchema,
    'ibm-content-exists': ibmRules.contentExists,
    'ibm-content-type-is-specific': ibmRules.ibmContentTypeIsSpecific,
    'ibm-content-type-parameter': ibmRules.contentTypeParameter,
    'ibm-delete-body': ibmRules.deleteBody,
    'ibm-description-mentions-json': ibmRules.descriptionMentionsJSON,
    'ibm-discriminator-property-exists': ibmRules.discriminatorPropertyExists,
    'ibm-duplicate-path-parameter': ibmRules.duplicatePathParameter,
    'ibm-enum-case': ibmRules.enumCaseConvention,
    'ibm-error-content-type-is-json': ibmRules.ibmErrorContentTypeIsJson,
    'ibm-etag-header-exists': ibmRules.etagHeaderExists,
    'ibm-examples-name-contains-space': ibmRules.examplesNameContainsSpace,
    'ibm-if-modified-since-parameter': ibmRules.ifModifiedSinceParameter,
    'ibm-if-unmodified-since-parameter': ibmRules.ifUnmodifiedSinceParameter,
    'ibm-inline-property-schema': ibmRules.inlinePropertySchema,
    'ibm-inline-request-schema': ibmRules.inlineRequestSchema,
    'ibm-inline-response-schema': ibmRules.inlineResponseSchema,
    'ibm-major-version-in-path': ibmRules.majorVersionInPath,
    'ibm-merge-patch-properties': ibmRules.mergePatchProperties,
    'ibm-operation-id-case-convention': ibmRules.operationIdCaseConvention,
    'ibm-operation-id-naming-convention': ibmRules.operationIdNamingConvention,
    'ibm-operation-summary': ibmRules.operationSummary,
    'ibm-optional-request-body': ibmRules.optionalRequestBody,
    'ibm-pagination-style': ibmRules.paginationStyle,
    'ibm-parameter-case-convention': ibmRules.parameterCaseConvention,
    'ibm-parameter-default': ibmRules.parameterDefault,
    'ibm-parameter-description': ibmRules.parameterDescription,
    'ibm-parameter-order': ibmRules.parameterOrder,
    'ibm-parameter-schema-or-content': ibmRules.parameterSchemaOrContent,
    'ibm-patch-request-content-type': ibmRules.patchRequestContentType,
    'ibm-path-param-not-crn': ibmRules.pathParamNotCRN,
    'ibm-path-segment-case-convention': ibmRules.pathSegmentCaseConvention,
    'ibm-precondition-header': ibmRules.preconditionHeader,
    'ibm-prohibit-summary-sentence-style':
      ibmRules.prohibitSummarySentenceStyle,
    'ibm-property-attributes': ibmRules.propertyAttributes,
    'ibm-property-case-collision': ibmRules.propertyCaseCollision,
    'ibm-property-case-convention': ibmRules.propertyCaseConvention,
    'ibm-property-description': ibmRules.propertyDescription,
    'ibm-property-inconsistent-name-and-type':
      ibmRules.propertyInconsistentNameAndType,
    'ibm-ref-pattern': ibmRules.refPattern,
    'ibm-ref-sibling-duplicate-description':
      ibmRules.refSiblingDuplicateDescription,
    'ibm-request-body-name': ibmRules.requestBodyName,
    'ibm-request-body-object': ibmRules.requestBodyObject,
    'ibm-required-property-missing': ibmRules.requiredPropertyMissing,
    'ibm-response-error-response-schema': ibmRules.responseErrorResponseSchema,
    'ibm-response-example-provided': ibmRules.responseExampleProvided,
    'ibm-response-status-codes': ibmRules.responseStatusCodes,
    'ibm-schema-description': ibmRules.schemaDescription,
    'ibm-schema-type': ibmRules.schemaType,
    'ibm-security-scheme-attributes': ibmRules.securitySchemeAttributes,
    'ibm-sdk-operations': ibmRules.ibmSdkOperations,
    'ibm-security-schemes': ibmRules.securitySchemes,
    'ibm-server-variable-default-value': ibmRules.serverVariableDefaultValue,
    'ibm-string-attributes': ibmRules.stringAttributes,
    'ibm-unused-tag': ibmRules.unusedTag,
    'ibm-valid-path-segments': ibmRules.validPathSegments,
    'ibm-valid-type-format': ibmRules.validTypeFormat
  }
};
