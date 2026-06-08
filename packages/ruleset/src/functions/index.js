/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

export const acceptAndReturnModels = require("./accept-and-return-models");
export const allowedKeywords = require("./allowed-keywords");
export const anchoredPatterns = require("./anchored-patterns");
export const apiSymmetry = require("./api-symmetry");
export const arrayAttributes = require("./array-attributes");
export const arrayOfArrays = require("./array-of-arrays");
export const arrayResponses = require("./array-responses");
export const avoidMultipleTypes = require("./avoid-multiple-types");
export const binarySchemas = require("./binary-schemas");
export const circularRefs = require("./circular-refs");
export const collectionArrayProperty = require("./collection-array-property");
export const consecutivePathSegments = require("./consecutive-path-segments");
export const deleteBody = require("./delete-body");
export const disallowedHeaderParameter = require("./disallowed-header-parameter");
export const discriminatorPropertyExists = require("./discriminator-property-exists");
export const duplicatePathParameter = require("./duplicate-path-parameter");
export const enumCasingConvention = require("./enum-casing-convention");
export const errorResponseSchemas = require("./error-response-schemas");
export const etagHeaderExists = require("./etag-header-exists");
export const inlineSchemas = require("./inline-schemas").default;
export const integerAttributes = require("./integer-attributes").default;
export const majorVersionInPath = require("./major-version-in-path").default;
export const mergePatchProperties = require("./merge-patch-properties").default;
export const noAmbiguousPaths = require("./no-ambiguous-paths").default;
export const noNullableProperties = require("./no-nullable-properties").default;
export const noOperationRequestBody =
  require("./no-operation-requestbody").default;
export const noRefInExample = require("./no-ref-in-example").default;
export const noSuperfluousAllOf = require("./no-superfluous-allof").default;
export const noUnsupportedKeywords =
  require("./no-unsupported-keywords").default;
export const operationIdCasingConvention =
  require("./operationid-casing-convention").default;
export const operationIdNamingConvention =
  require("./operationid-naming-convention").default;
export const operationSummaryExists =
  require("./operation-summary-exists").default;
export const operationSummaryLength =
  require("./operation-summary-length").default;
export const optionalRequestBody = require("./optional-request-body").default
  .optionalRequestBody;
export const optionalRequestBodyDeprecated = require("./optional-request-body")
  .default.optionalRequestBodyDeprecated;
export const paginationStyle = require("./pagination-style").default;
export const parameterCasingConvention =
  require("./parameter-casing-convention").default;
export const parameterDefault = require("./parameter-default").default;
export const parameterDescriptionExists =
  require("./parameter-description-exists").default;
export const parameterOrder = require("./parameter-order").default;
export const patchRequestContentType =
  require("./patch-request-content-type").default;
export const pathParameterNotCRN = require("./path-parameter-not-crn").default;
export const pathSegmentCasingConvention =
  require("./path-segment-casing-convention").default;
export const patternPropertiesCheck = require("./pattern-properties").default;
export const preconditionHeader = require("./precondition-header").default;
export const preferTokenPagination =
  require("./prefer-token-pagination").default;
export const propertyAttributes = require("./property-attributes").default;
export const propertyCasingConvention =
  require("./property-casing-convention").default;
export const propertyConsistentNameAndType =
  require("./property-consistent-name-and-type").default;
export const propertyDescriptionExists =
  require("./property-description-exists").default;
export const propertyNameCollision =
  require("./property-name-collision").default;
export const redirectResponseBody = require("./redirect-response-body").default;
export const refPattern = require("./ref-pattern").default;
export const refSiblingDuplicateDescription =
  require("./ref-sibling-duplicate-description").default;
export const requestAndResponseContent =
  require("./request-and-response-content").default;
export const requestBodyName = require("./requestbody-name").default;
export const requiredArrayPropertiesInResponse =
  require("./required-array-properties-in-response").default;
export const requiredEnumPropertiesInResponse =
  require("./required-enum-properties-in-response").default;
export const requiredProperty = require("./required-property").default;
export const resourceResponseConsistency =
  require("./resource-response-consistency").default;
export const responseExampleExists =
  require("./response-example-exists").default;
export const responseStatusCodes = require("./response-status-codes").default;
export const schemaCasingConvention =
  require("./schema-casing-convention").default;
export const schemaDescriptionExists =
  require("./schema-description-exists").default;
export const schemaNamingConvention =
  require("./schema-naming-convention").default;
export const schemaOrContentProvided =
  require("./schema-or-content-provided").default;
export const schemaTypeExists = require("./schema-type-exists").default;
export const schemaTypeFormat = require("./schema-type-format").default;
export const securitySchemeAttributes =
  require("./securityscheme-attributes").default;
export const securitySchemes = require("./securityschemes").default;
export const stringAttributes = require("./string-attributes").default;
export const unevaluatedProperties =
  require("./unevaluated-properties").default;
export const uniqueParameterRequestPropertyNames =
  require("./unique-parameter-request-property-names").default;
export const unusedTags = require("./unused-tags").default;
export const useDateBasedFormat = require("./use-date-based-format").default;
export const validatePathSegments = require("./valid-path-segments").default;
export const validSchemaExample = require("./valid-schema-example").default;
export const wellDefinedDictionaries =
  require("./well-defined-dictionaries").default;
