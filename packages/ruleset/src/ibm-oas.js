/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { oas } = require('@stoplight/spectral-rulesets');
const ibmRules = require('./rules');

// Spectral's "no-$ref-siblings" rule is configured to run on
// OpenAPI 3.0.x documents (ref sibling attributes are allowed in OpenAPI 3.1.x).
// However, we want to enable this rule also for OpenAPI 3.1.x documents,
// so we'll just tweak Spectral's rule definition here.
oas.rules['no-$ref-siblings'].formats = [oas3];

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
    // Enable with same settings as Spectral, but override the rule to modify
    // the 'given' field to only check schemas - Spectral checks everything.
    'typed-enum': ibmRules.typedEnum,
    // Enable with same severity as Spectral
    'oas2-api-host': true,
    // Enable with same severity as Spectral
    'oas2-api-schemes': true,
    // Enable with same severity as Spectral
    'oas2-host-trailing-slash': true,
    // Turn off - duplicates non-configurable validation - security-ibm.js
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
    // Turn off - duplicates non-configurable validation - security-ibm.js
    'oas3-operation-security-defined': 'off',
    // Enable with same severity as Spectral
    'oas3-server-trailing-slash': true,
    // Enable with warn severity
    'oas3-valid-media-example': 'warn',
    // Disable - replaced with ibm-valid-schema-example.
    'oas3-valid-schema-example': 'off',
    // Enable with same severity as Spectral
    'oas3-schema': true,
    // Turn off - duplicates non-configurable validation in base validator
    'oas3-unused-component': true,
    // Turn off 'array-items' rule in favor of our 'ibm-array-attributes' rule
    'array-items': 'off',

    // IBM Custom Rules
    'ibm-accept-and-return-models': ibmRules.acceptAndReturnModels,
    'ibm-anchored-patterns': ibmRules.anchoredPatterns,
    'ibm-api-symmetry': ibmRules.apiSymmetry,
    'ibm-array-attributes': ibmRules.arrayAttributes,
    'ibm-avoid-inline-schemas': ibmRules.inlineSchemas,
    'ibm-avoid-multiple-types': ibmRules.avoidMultipleTypes,
    'ibm-avoid-property-name-collision': ibmRules.propertyNameCollision,
    'ibm-avoid-repeating-path-parameters': ibmRules.duplicatePathParameter,
    'ibm-binary-schemas': ibmRules.binarySchemas,
    'ibm-collection-array-property': ibmRules.collectionArrayProperty,
    'ibm-content-contains-schema': ibmRules.contentContainsSchema,
    'ibm-content-type-is-specific': ibmRules.contentTypeIsSpecific,
    'ibm-define-required-properties': ibmRules.requiredPropertyMissing,
    'ibm-discriminator-property': ibmRules.discriminatorPropertyExists,
    'ibm-dont-require-merge-patch-properties': ibmRules.mergePatchProperties,
    'ibm-enum-casing-convention': ibmRules.enumCasingConvention,
    'ibm-error-content-type-is-json': ibmRules.errorContentTypeIsJson,
    'ibm-error-response-schemas': ibmRules.errorResponseSchemas,
    'ibm-etag-header': ibmRules.etagHeaderExists,
    'ibm-integer-attributes': ibmRules.integerAttributes,
    'ibm-major-version-in-path': ibmRules.majorVersionInPath,
    'ibm-no-accept-header': ibmRules.acceptHeader,
    'ibm-no-ambiguous-paths': ibmRules.noAmbiguousPaths,
    'ibm-no-array-of-arrays': ibmRules.arrayOfArrays,
    'ibm-no-array-responses': ibmRules.arrayResponses,
    'ibm-no-authorization-header': ibmRules.authorizationHeader,
    'ibm-no-body-for-delete': ibmRules.deleteBody,
    'ibm-no-circular-refs': ibmRules.circularRefs,
    'ibm-no-consecutive-path-parameter-segments':
      ibmRules.consecutivePathSegments,
    'ibm-no-content-type-header': ibmRules.contentTypeHeader,
    'ibm-no-crn-path-parameters': ibmRules.pathParameterNotCRN,
    'ibm-no-default-for-required-parameter': ibmRules.parameterDefault,
    'ibm-no-duplicate-description-with-ref-sibling':
      ibmRules.refSiblingDuplicateDescription,
    'ibm-no-if-modified-since-header': ibmRules.ifModifiedSinceHeader,
    'ibm-no-if-unmodified-since-header': ibmRules.ifUnmodifiedSinceHeader,
    'ibm-no-nullable-properties': ibmRules.noNullableProperties,
    'ibm-no-operation-requestbody': ibmRules.noOperationRequestBody,
    'ibm-no-optional-properties-in-required-body':
      ibmRules.optionalRequestBodyDeprecated,
    'ibm-no-ref-in-example': ibmRules.noRefInExample,
    'ibm-no-required-properties-in-optional-body': ibmRules.optionalRequestBody,
    'ibm-no-space-in-example-name': ibmRules.examplesNameContainsSpace,
    'ibm-no-superfluous-allof': ibmRules.noSuperfluousAllOf,
    'ibm-no-unsupported-keywords': ibmRules.noUnsupportedKeywords,
    'ibm-openapi-tags-used': ibmRules.unusedTags,
    'ibm-operation-responses': ibmRules.operationResponses,
    'ibm-operation-summary': ibmRules.operationSummaryExists,
    'ibm-operation-summary-length': ibmRules.operationSummaryLength,
    'ibm-operationid-casing-convention': ibmRules.operationIdCasingConvention,
    'ibm-operationid-naming-convention': ibmRules.operationIdNamingConvention,
    'ibm-pagination-style': ibmRules.paginationStyle,
    'ibm-parameter-casing-convention': ibmRules.parameterCasingConvention,
    'ibm-parameter-description': ibmRules.parameterDescriptionExists,
    'ibm-parameter-order': ibmRules.parameterOrder,
    'ibm-parameter-schema-or-content': ibmRules.parameterSchemaOrContentExists,
    'ibm-patch-request-content-type': ibmRules.patchRequestContentType,
    'ibm-path-segment-casing-convention': ibmRules.pathSegmentCasingConvention,
    'ibm-pattern-properties': ibmRules.patternProperties,
    'ibm-precondition-headers': ibmRules.preconditionHeader,
    'ibm-prefer-token-pagination': ibmRules.preferTokenPagination,
    'ibm-property-attributes': ibmRules.propertyAttributes,
    'ibm-property-casing-convention': ibmRules.propertyCasingConvention,
    'ibm-property-consistent-name-and-type':
      ibmRules.propertyConsistentNameAndType,
    'ibm-property-description': ibmRules.propertyDescriptionExists,
    'ibm-redirect-response-body': ibmRules.redirectResponseBody,
    'ibm-ref-pattern': ibmRules.refPattern,
    'ibm-request-and-response-content': ibmRules.requestAndResponseContent,
    'ibm-requestbody-is-object': ibmRules.requestBodyIsObject,
    'ibm-requestbody-name': ibmRules.requestBodyName,
    'ibm-required-array-properties-in-response':
      ibmRules.requiredArrayPropertiesInResponse,
    'ibm-required-enum-properties-in-response':
      ibmRules.requiredEnumPropertiesInResponse,
    'ibm-resource-response-consistency': ibmRules.resourceResponseConsistency,
    'ibm-response-status-codes': ibmRules.responseStatusCodes,
    'ibm-schema-casing-convention': ibmRules.schemaCasingConvention,
    'ibm-schema-description': ibmRules.schemaDescriptionExists,
    'ibm-schema-keywords': ibmRules.schemaKeywords,
    'ibm-schema-naming-convention': ibmRules.schemaNamingConvention,
    'ibm-schema-type': ibmRules.schemaTypeExists,
    'ibm-schema-type-format': ibmRules.schemaTypeFormat,
    'ibm-sdk-operations': ibmRules.ibmSdkOperations,
    'ibm-securityscheme-attributes': ibmRules.securitySchemeAttributes,
    'ibm-securityschemes': ibmRules.securitySchemes,
    'ibm-server-variable-default-value': ibmRules.serverVariableDefaultValue,
    'ibm-string-attributes': ibmRules.stringAttributes,
    'ibm-success-response-example': ibmRules.responseExampleExists,
    'ibm-summary-sentence-style': ibmRules.summarySentenceStyle,
    'ibm-unevaluated-properties': ibmRules.unevaluatedProperties,
    'ibm-unique-parameter-request-property-names':
      ibmRules.uniqueParameterRequestPropertyNames,
    'ibm-use-date-based-format': ibmRules.useDateBasedFormat,
    'ibm-valid-path-segments': ibmRules.validPathSegments,
    'ibm-valid-schema-example': ibmRules.validSchemaExample,
    'ibm-well-defined-dictionaries': ibmRules.wellDefinedDictionaries,
  },
};
