/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import * as acceptAndReturnModelsModule from './accept-and-return-models.js';
import * as acceptHeaderModule from './accept-header.js';
import * as anchoredPatternsModule from './anchored-patterns.js';
import * as apiSymmetryModule from './api-symmetry.js';
import * as arrayAttributesModule from './array-attributes.js';
import * as arrayOfArraysModule from './array-of-arrays.js';
import * as arrayResponsesModule from './array-responses.js';
import * as authorizationHeaderModule from './authorization-header.js';
import * as avoidMultipleTypesModule from './avoid-multiple-types.js';
import * as binarySchemasModule from './binary-schemas.js';
import * as circularRefsModule from './circular-refs.js';
import * as collectionArrayPropertyModule from './collection-array-property.js';
import * as consecutivePathSegmentsModule from './consecutive-path-segments.js';
import * as contentContainsSchemaModule from './content-contains-schema.js';
import * as contentTypeHeaderModule from './content-type-header.js';
import * as contentTypeIsSpecificModule from './content-type-is-specific.js';
import * as deleteBodyModule from './delete-body.js';
import * as discriminatorPropertyExistsModule from './discriminator-property-exists.js';
import * as duplicatePathParameterModule from './duplicate-path-parameter.js';
import * as etagHeaderExistsModule from './etag-header-exists.js';
import * as enumCasingConventionModule from './enum-casing-convention.js';
import * as errorContentTypeIsJsonModule from './error-content-type-is-json.js';
import * as errorResponseSchemasModule from './error-response-schemas.js';
import * as examplesNameContainsSpaceModule from './examples-name-contains-space.js';
import * as ibmSdkOperationsModule from './ibm-sdk-operations.js';
import * as ifModifiedSinceHeaderModule from './if-modified-since-header.js';
import * as ifUnmodifiedSinceHeaderModule from './if-unmodified-since-header.js';
import * as inlineSchemasModule from './inline-schemas.js';
import * as integerAttributesModule from './integer-attributes.js';
import * as majorVersionInPathModule from './major-version-in-path.js';
import * as mergePatchPropertiesModule from './merge-patch-properties.js';
import * as noAmbiguousPathsModule from './no-ambiguous-paths.js';
import * as noNullablePropertiesModule from './no-nullable-properties.js';
import * as noOperationRequestBodyModule from './no-operation-requestbody.js';
import * as noRefInExampleModule from './no-ref-in-example.js';
import * as noSuperfluousAllOfModule from './no-superfluous-allof.js';
import * as noUnsupportedKeywordsModule from './no-unsupported-keywords.js';
import * as operationIdCasingConventionModule from './operationid-casing-convention.js';
import * as operationIdNamingConventionModule from './operationid-naming-convention.js';
import * as operationResponsesModule from './operation-responses.js';
import * as operationSummaryExistsModule from './operation-summary-exists.js';
import * as operationSummaryLengthModule from './operation-summary-length.js';
import * as optionalRequestBodyModule from './optional-request-body.js';
import * as optionalRequestBodyDeprecatedModule from './optional-request-body-deprecated.js';
import * as paginationStyleModule from './pagination-style.js';
import * as parameterCasingConventionModule from './parameter-casing-convention.js';
import * as parameterDefaultModule from './parameter-default.js';
import * as parameterDescriptionExistsModule from './parameter-description-exists.js';
import * as parameterOrderModule from './parameter-order.js';
import * as parameterSchemaOrContentExistsModule from './parameter-schema-or-content-exists.js';
import * as patchRequestContentTypeModule from './patch-request-content-type.js';
import * as pathParameterNotCRNModule from './path-parameter-not-crn.js';
import * as pathSegmentCasingConventionModule from './path-segment-casing-convention.js';
import * as patternPropertiesModule from './pattern-properties.js';
import * as preconditionHeaderModule from './precondition-header.js';
import * as preferTokenPaginationModule from './prefer-token-pagination.js';
import * as propertyAttributesModule from './property-attributes.js';
import * as propertyCasingConventionModule from './property-casing-convention.js';
import * as propertyConsistentNameAndTypeModule from './property-consistent-name-and-type.js';
import * as propertyDescriptionExistsModule from './property-description-exists.js';
import * as propertyNameCollisionModule from './property-name-collision.js';
import * as redirectResponseBodyModule from './redirect-response-body.js';
import * as refPatternModule from './ref-pattern.js';
import * as refSiblingDuplicateDescriptionModule from './ref-sibling-duplicate-description.js';
import * as requestAndResponseContentModule from './request-and-response-content.js';
import * as requestBodyIsObjectModule from './requestbody-is-object.js';
import * as requestBodyNameModule from './requestbody-name.js';
import * as requiredArrayPropertiesInResponseModule from './required-array-properties-in-response.js';
import * as requiredEnumPropertiesInResponseModule from './required-enum-properties-in-response.js';
import * as requiredPropertyMissingModule from './required-property-missing.js';
import * as resourceResponseConsistencyModule from './resource-response-consistency.js';
import * as responseExampleExistsModule from './response-example-exists.js';
import * as responseStatusCodesModule from './response-status-codes.js';
import * as schemaCasingConventionModule from './schema-casing-convention.js';
import * as schemaDescriptionExistsModule from './schema-description-exists.js';
import * as schemaKeywordsModule from './schema-keywords.js';
import * as schemaNamingConventionModule from './schema-naming-convention.js';
import * as schemaTypeExistsModule from './schema-type-exists.js';
import * as schemaTypeFormatModule from './schema-type-format.js';
import * as securitySchemesModule from './securityschemes.js';
import * as securitySchemeAttributesModule from './securityscheme-attributes.js';
import * as serverVariableDefaultValueModule from './server-variable-default-value.js';
import * as stringAttributesModule from './string-attributes.js';
import * as summarySentenceStyleModule from './summary-sentence-style.js';
import typedEnumDefault from './typed-enum.js';
import * as unevaluatedPropertiesModule from './unevaluated-properties.js';
import * as unusedTagsModule from './unused-tags.js';
import * as uniqueParameterRequestPropertyNamesModule from './unique-parameter-request-property-names.js';
import * as useDateBasedFormatModule from './use-date-based-format.js';
import * as validPathSegmentsModule from './valid-path-segments.js';
import * as validSchemaExampleModule from './valid-schema-example.js';
import * as wellDefinedDictionariesModule from './well-defined-dictionaries.js';

export const acceptAndReturnModels = acceptAndReturnModelsModule;
export const acceptHeader = acceptHeaderModule;
export const anchoredPatterns = anchoredPatternsModule;
export const apiSymmetry = apiSymmetryModule;
export const arrayAttributes = arrayAttributesModule;
export const arrayOfArrays = arrayOfArraysModule;
export const arrayResponses = arrayResponsesModule;
export const authorizationHeader = authorizationHeaderModule;
export const avoidMultipleTypes = avoidMultipleTypesModule;
export const binarySchemas = binarySchemasModule;
export const circularRefs = circularRefsModule;
export const collectionArrayProperty = collectionArrayPropertyModule;
export const consecutivePathSegments = consecutivePathSegmentsModule;
export const contentContainsSchema = contentContainsSchemaModule;
export const contentTypeHeader = contentTypeHeaderModule;
export const contentTypeIsSpecific = contentTypeIsSpecificModule;
export const deleteBody = deleteBodyModule;
export const discriminatorPropertyExists = discriminatorPropertyExistsModule;
export const duplicatePathParameter = duplicatePathParameterModule;
export const etagHeaderExists = etagHeaderExistsModule;
export const enumCasingConvention = enumCasingConventionModule;
export const errorContentTypeIsJson = errorContentTypeIsJsonModule;
export const errorResponseSchemas = errorResponseSchemasModule;
export const examplesNameContainsSpace = examplesNameContainsSpaceModule;
export const ibmSdkOperations = ibmSdkOperationsModule;
export const ifModifiedSinceHeader = ifModifiedSinceHeaderModule;
export const ifUnmodifiedSinceHeader = ifUnmodifiedSinceHeaderModule;
export const inlineSchemas = inlineSchemasModule;
export const integerAttributes = integerAttributesModule;
export const majorVersionInPath = majorVersionInPathModule;
export const mergePatchProperties = mergePatchPropertiesModule;
export const noAmbiguousPaths = noAmbiguousPathsModule;
export const noNullableProperties = noNullablePropertiesModule;
export const noOperationRequestBody = noOperationRequestBodyModule;
export const noRefInExample = noRefInExampleModule;
export const noSuperfluousAllOf = noSuperfluousAllOfModule;
export const noUnsupportedKeywords = noUnsupportedKeywordsModule;
export const operationIdCasingConvention = operationIdCasingConventionModule;
export const operationIdNamingConvention = operationIdNamingConventionModule;
export const operationResponses = operationResponsesModule;
export const operationSummaryExists = operationSummaryExistsModule;
export const operationSummaryLength = operationSummaryLengthModule;
export const optionalRequestBody = optionalRequestBodyModule;
export const optionalRequestBodyDeprecated = optionalRequestBodyDeprecatedModule;
export const paginationStyle = paginationStyleModule;
export const parameterCasingConvention = parameterCasingConventionModule;
export const parameterDefault = parameterDefaultModule;
export const parameterDescriptionExists = parameterDescriptionExistsModule;
export const parameterOrder = parameterOrderModule;
export const parameterSchemaOrContentExists = parameterSchemaOrContentExistsModule;
export const patchRequestContentType = patchRequestContentTypeModule;
export const pathParameterNotCRN = pathParameterNotCRNModule;
export const pathSegmentCasingConvention = pathSegmentCasingConventionModule;
export const patternProperties = patternPropertiesModule;
export const preconditionHeader = preconditionHeaderModule;
export const preferTokenPagination = preferTokenPaginationModule;
export const propertyAttributes = propertyAttributesModule;
export const propertyCasingConvention = propertyCasingConventionModule;
export const propertyConsistentNameAndType = propertyConsistentNameAndTypeModule;
export const propertyDescriptionExists = propertyDescriptionExistsModule;
export const propertyNameCollision = propertyNameCollisionModule;
export const redirectResponseBody = redirectResponseBodyModule;
export const refPattern = refPatternModule;
export const refSiblingDuplicateDescription = refSiblingDuplicateDescriptionModule;
export const requestAndResponseContent = requestAndResponseContentModule;
export const requestBodyIsObject = requestBodyIsObjectModule;
export const requestBodyName = requestBodyNameModule;
export const requiredArrayPropertiesInResponse = requiredArrayPropertiesInResponseModule;
export const requiredEnumPropertiesInResponse = requiredEnumPropertiesInResponseModule;
export const requiredPropertyMissing = requiredPropertyMissingModule;
export const resourceResponseConsistency = resourceResponseConsistencyModule;
export const responseExampleExists = responseExampleExistsModule;
export const responseStatusCodes = responseStatusCodesModule;
export const schemaCasingConvention = schemaCasingConventionModule;
export const schemaDescriptionExists = schemaDescriptionExistsModule;
export const schemaKeywords = schemaKeywordsModule;
export const schemaNamingConvention = schemaNamingConventionModule;
export const schemaTypeExists = schemaTypeExistsModule;
export const schemaTypeFormat = schemaTypeFormatModule;
export const securitySchemes = securitySchemesModule;
export const securitySchemeAttributes = securitySchemeAttributesModule;
export const serverVariableDefaultValue = serverVariableDefaultValueModule;
export const stringAttributes = stringAttributesModule;
export const summarySentenceStyle = summarySentenceStyleModule;
export const typedEnum = typedEnumDefault;
export const unevaluatedProperties = unevaluatedPropertiesModule;
export const unusedTags = unusedTagsModule;
export const uniqueParameterRequestPropertyNames = uniqueParameterRequestPropertyNamesModule;
export const useDateBasedFormat = useDateBasedFormatModule;
export const validPathSegments = validPathSegmentsModule;
export const validSchemaExample = validSchemaExampleModule;
export const wellDefinedDictionaries = wellDefinedDictionariesModule;

export default {
  acceptAndReturnModels,
  acceptHeader,
  anchoredPatterns,
  apiSymmetry,
  arrayAttributes,
  arrayOfArrays,
  arrayResponses,
  authorizationHeader,
  avoidMultipleTypes,
  binarySchemas,
  circularRefs,
  collectionArrayProperty,
  consecutivePathSegments,
  contentContainsSchema,
  contentTypeHeader,
  contentTypeIsSpecific,
  deleteBody,
  discriminatorPropertyExists,
  duplicatePathParameter,
  etagHeaderExists,
  enumCasingConvention,
  errorContentTypeIsJson,
  errorResponseSchemas,
  examplesNameContainsSpace,
  ibmSdkOperations,
  ifModifiedSinceHeader,
  ifUnmodifiedSinceHeader,
  inlineSchemas,
  integerAttributes,
  majorVersionInPath,
  mergePatchProperties,
  noAmbiguousPaths,
  noNullableProperties,
  noOperationRequestBody,
  noRefInExample,
  noSuperfluousAllOf,
  noUnsupportedKeywords,
  operationIdCasingConvention,
  operationIdNamingConvention,
  operationResponses,
  operationSummaryExists,
  operationSummaryLength,
  optionalRequestBody,
  optionalRequestBodyDeprecated,
  paginationStyle,
  parameterCasingConvention,
  parameterDefault,
  parameterDescriptionExists,
  parameterOrder,
  parameterSchemaOrContentExists,
  patchRequestContentType,
  pathParameterNotCRN,
  pathSegmentCasingConvention,
  patternProperties,
  preconditionHeader,
  preferTokenPagination,
  propertyAttributes,
  propertyCasingConvention,
  propertyConsistentNameAndType,
  propertyDescriptionExists,
  propertyNameCollision,
  redirectResponseBody,
  refPattern,
  refSiblingDuplicateDescription,
  requestAndResponseContent,
  requestBodyIsObject,
  requestBodyName,
  requiredArrayPropertiesInResponse,
  requiredEnumPropertiesInResponse,
  requiredPropertyMissing,
  resourceResponseConsistency,
  responseExampleExists,
  responseStatusCodes,
  schemaCasingConvention,
  schemaDescriptionExists,
  schemaKeywords,
  schemaNamingConvention,
  schemaTypeExists,
  schemaTypeFormat,
  securitySchemes,
  securitySchemeAttributes,
  serverVariableDefaultValue,
  stringAttributes,
  summarySentenceStyle,
  typedEnum,
  unevaluatedProperties,
  unusedTags,
  uniqueParameterRequestPropertyNames,
  useDateBasedFormat,
  validPathSegments,
  validSchemaExample,
  wellDefinedDictionaries,
};
