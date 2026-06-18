/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { oas } from '@stoplight/spectral-rulesets';
import {
  typedEnum,
  acceptAndReturnModels,
  anchoredPatterns,
  apiSymmetry,
  arrayAttributes,
  inlineSchemas,
  avoidMultipleTypes,
  propertyNameCollision,
  duplicatePathParameter,
  binarySchemas,
  collectionArrayProperty,
  contentContainsSchema,
  contentTypeIsSpecific,
  requiredPropertyMissing,
  discriminatorPropertyExists,
  mergePatchProperties,
  enumCasingConvention,
  errorContentTypeIsJson,
  errorResponseSchemas,
  etagHeaderExists,
  integerAttributes,
  majorVersionInPath,
  acceptHeader,
  noAmbiguousPaths,
  arrayOfArrays,
  arrayResponses,
  authorizationHeader,
  deleteBody,
  circularRefs,
  consecutivePathSegments,
  contentTypeHeader,
  pathParameterNotCRN,
  parameterDefault,
  refSiblingDuplicateDescription,
  ifModifiedSinceHeader,
  ifUnmodifiedSinceHeader,
  noNullableProperties,
  noOperationRequestBody,
  optionalRequestBodyDeprecated,
  noRefInExample,
  optionalRequestBody,
  examplesNameContainsSpace,
  noSuperfluousAllOf,
  noUnsupportedKeywords,
  unusedTags,
  operationResponses,
  operationSummaryExists,
  operationSummaryLength,
  operationIdCasingConvention,
  operationIdNamingConvention,
  paginationStyle,
  parameterCasingConvention,
  parameterDescriptionExists,
  parameterOrder,
  parameterSchemaOrContentExists,
  patchRequestContentType,
  pathSegmentCasingConvention,
  patternProperties,
  preconditionHeader,
  preferTokenPagination,
  propertyAttributes,
  propertyCasingConvention,
  propertyConsistentNameAndType,
  propertyDescriptionExists,
  redirectResponseBody,
  refPattern,
  requestAndResponseContent,
  requestBodyIsObject,
  requestBodyName,
  requiredArrayPropertiesInResponse,
  requiredEnumPropertiesInResponse,
  resourceResponseConsistency,
  responseStatusCodes,
  schemaCasingConvention,
  schemaDescriptionExists,
  schemaKeywords,
  schemaNamingConvention,
  schemaTypeExists,
  schemaTypeFormat,
  ibmSdkOperations,
  securitySchemeAttributes,
  securitySchemes,
  serverVariableDefaultValue,
  stringAttributes,
  responseExampleExists,
  summarySentenceStyle,
  unevaluatedProperties,
  uniqueParameterRequestPropertyNames,
  useDateBasedFormat,
  validPathSegments,
  validSchemaExample,
  wellDefinedDictionaries,
} from './rules/index.js';

// Spectral's "no-$ref-siblings" rule is configured to run on
// OpenAPI 3.0.x documents (ref sibling attributes are allowed in OpenAPI 3.1.x).
// However, we want to enable this rule also for OpenAPI 3.1.x documents,
// so we'll just tweak Spectral's rule definition here.
oas.rules['no-$ref-siblings'].formats = [oas3];

export { oas as extends };
export const documentationUrl =
  'https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md';
export const formats = [oas3];
export const rules = {
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
  'typed-enum': typedEnum,
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
  'ibm-accept-and-return-models': acceptAndReturnModels,
  'ibm-anchored-patterns': anchoredPatterns,
  'ibm-api-symmetry': apiSymmetry,
  'ibm-array-attributes': arrayAttributes,
  'ibm-avoid-inline-schemas': inlineSchemas,
  'ibm-avoid-multiple-types': avoidMultipleTypes,
  'ibm-avoid-property-name-collision': propertyNameCollision,
  'ibm-avoid-repeating-path-parameters': duplicatePathParameter,
  'ibm-binary-schemas': binarySchemas,
  'ibm-collection-array-property': collectionArrayProperty,
  'ibm-content-contains-schema': contentContainsSchema,
  'ibm-content-type-is-specific': contentTypeIsSpecific,
  'ibm-define-required-properties': requiredPropertyMissing,
  'ibm-discriminator-property': discriminatorPropertyExists,
  'ibm-dont-require-merge-patch-properties': mergePatchProperties,
  'ibm-enum-casing-convention': enumCasingConvention,
  'ibm-error-content-type-is-json': errorContentTypeIsJson,
  'ibm-error-response-schemas': errorResponseSchemas,
  'ibm-etag-header': etagHeaderExists,
  'ibm-integer-attributes': integerAttributes,
  'ibm-major-version-in-path': majorVersionInPath,
  'ibm-no-accept-header': acceptHeader,
  'ibm-no-ambiguous-paths': noAmbiguousPaths,
  'ibm-no-array-of-arrays': arrayOfArrays,
  'ibm-no-array-responses': arrayResponses,
  'ibm-no-authorization-header': authorizationHeader,
  'ibm-no-body-for-delete': deleteBody,
  'ibm-no-circular-refs': circularRefs,
  'ibm-no-consecutive-path-parameter-segments': consecutivePathSegments,
  'ibm-no-content-type-header': contentTypeHeader,
  'ibm-no-crn-path-parameters': pathParameterNotCRN,
  'ibm-no-default-for-required-parameter': parameterDefault,
  'ibm-no-duplicate-description-with-ref-sibling':
    refSiblingDuplicateDescription,
  'ibm-no-if-modified-since-header': ifModifiedSinceHeader,
  'ibm-no-if-unmodified-since-header': ifUnmodifiedSinceHeader,
  'ibm-no-nullable-properties': noNullableProperties,
  'ibm-no-operation-requestbody': noOperationRequestBody,
  'ibm-no-optional-properties-in-required-body': optionalRequestBodyDeprecated,
  'ibm-no-ref-in-example': noRefInExample,
  'ibm-no-required-properties-in-optional-body': optionalRequestBody,
  'ibm-no-space-in-example-name': examplesNameContainsSpace,
  'ibm-no-superfluous-allof': noSuperfluousAllOf,
  'ibm-no-unsupported-keywords': noUnsupportedKeywords,
  'ibm-openapi-tags-used': unusedTags,
  'ibm-operation-responses': operationResponses,
  'ibm-operation-summary': operationSummaryExists,
  'ibm-operation-summary-length': operationSummaryLength,
  'ibm-operationid-casing-convention': operationIdCasingConvention,
  'ibm-operationid-naming-convention': operationIdNamingConvention,
  'ibm-pagination-style': paginationStyle,
  'ibm-parameter-casing-convention': parameterCasingConvention,
  'ibm-parameter-description': parameterDescriptionExists,
  'ibm-parameter-order': parameterOrder,
  'ibm-parameter-schema-or-content': parameterSchemaOrContentExists,
  'ibm-patch-request-content-type': patchRequestContentType,
  'ibm-path-segment-casing-convention': pathSegmentCasingConvention,
  'ibm-pattern-properties': patternProperties,
  'ibm-precondition-headers': preconditionHeader,
  'ibm-prefer-token-pagination': preferTokenPagination,
  'ibm-property-attributes': propertyAttributes,
  'ibm-property-casing-convention': propertyCasingConvention,
  'ibm-property-consistent-name-and-type': propertyConsistentNameAndType,
  'ibm-property-description': propertyDescriptionExists,
  'ibm-redirect-response-body': redirectResponseBody,
  'ibm-ref-pattern': refPattern,
  'ibm-request-and-response-content': requestAndResponseContent,
  'ibm-requestbody-is-object': requestBodyIsObject,
  'ibm-requestbody-name': requestBodyName,
  'ibm-required-array-properties-in-response':
    requiredArrayPropertiesInResponse,
  'ibm-required-enum-properties-in-response': requiredEnumPropertiesInResponse,
  'ibm-resource-response-consistency': resourceResponseConsistency,
  'ibm-response-status-codes': responseStatusCodes,
  'ibm-schema-casing-convention': schemaCasingConvention,
  'ibm-schema-description': schemaDescriptionExists,
  'ibm-schema-keywords': schemaKeywords,
  'ibm-schema-naming-convention': schemaNamingConvention,
  'ibm-schema-type': schemaTypeExists,
  'ibm-schema-type-format': schemaTypeFormat,
  'ibm-sdk-operations': ibmSdkOperations,
  'ibm-securityscheme-attributes': securitySchemeAttributes,
  'ibm-securityschemes': securitySchemes,
  'ibm-server-variable-default-value': serverVariableDefaultValue,
  'ibm-string-attributes': stringAttributes,
  'ibm-success-response-example': responseExampleExists,
  'ibm-summary-sentence-style': summarySentenceStyle,
  'ibm-unevaluated-properties': unevaluatedProperties,
  'ibm-unique-parameter-request-property-names':
    uniqueParameterRequestPropertyNames,
  'ibm-use-date-based-format': useDateBasedFormat,
  'ibm-valid-path-segments': validPathSegments,
  'ibm-valid-schema-example': validSchemaExample,
  'ibm-well-defined-dictionaries': wellDefinedDictionaries,
};
