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
    // Turn off - duplicates $ref_siblings (off by default)
    'no-$ref-siblings': 'off',
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

    'accept-parameter': ibmRules.acceptParameter,
    'array-of-arrays': ibmRules.arrayOfArrays,
    'array-responses': ibmRules.arrayResponses,
    'authorization-parameter': ibmRules.authorizationParameter,
    'content-entry-contains-schema': ibmRules.contentEntryContainsSchema,
    'content-entry-provided': ibmRules.contentEntryProvided,
    'content-type-parameter': ibmRules.contentTypeParameter,
    'description-mentions-json': ibmRules.descriptionMentionsJSON,
    discriminator: ibmRules.discriminator,
    'duplicate-path-parameter': ibmRules.duplicatePathParameter,
    'enum-case-convention': ibmRules.enumCaseConvention,
    'examples-name-contains-space': ibmRules.examplesNameContainsSpace,
    'ibm-content-type-is-specific': ibmRules.ibmContentTypeIsSpecific,
    'ibm-error-content-type-is-json': ibmRules.ibmErrorContentTypeIsJson,
    'ibm-sdk-operations': ibmRules.ibmSdkOperations,
    'major-version-in-path': ibmRules.majorVersionInPath,
    'missing-required-property': ibmRules.missingRequiredProperty,
    'operation-id-case-convention': ibmRules.operationIdCaseConvention,
    'operation-id-naming-convention': ibmRules.operationIdNamingConvention,
    'operation-summary': ibmRules.operationSummary,
    'pagination-style': ibmRules.paginationStyle,
    'parameter-case-convention': ibmRules.parameterCaseConvention,
    'parameter-default': ibmRules.parameterDefault,
    'parameter-description': ibmRules.parameterDescription,
    'parameter-order': ibmRules.parameterOrder,
    'parameter-schema-or-content': ibmRules.parameterSchemaOrContent,
    'prohibit-summary-sentence-style': ibmRules.prohibitSummarySentenceStyle,
    'property-case-collision': ibmRules.propertyCaseCollision,
    'property-case-convention': ibmRules.propertyCaseConvention,
    'property-description': ibmRules.propertyDescription,
    'property-inconsistent-name-and-type':
      ibmRules.propertyInconsistentNameAndType,
    'request-body-name': ibmRules.requestBodyName,
    'request-body-object': ibmRules.requestBodyObject,
    'response-error-response-schema': ibmRules.responseErrorResponseSchema,
    'response-example-provided': ibmRules.responseExampleProvided,
    'schema-description': ibmRules.schemaDescription,
    'security-schemes': ibmRules.securitySchemes,
    'server-variable-default-value': ibmRules.serverVariableDefaultValue,
    'string-boundary': ibmRules.stringBoundary,
    'unused-tag': ibmRules.unusedTag,
    'valid-type-format': ibmRules.validTypeFormat
  }
};
