const { oas3 } = require('@stoplight/spectral-formats');
const { oas } = require('@stoplight/spectral-rulesets');
const ibmRules = require('./rules');
module.exports = {
  extends: oas,
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
    // Turn off - duplicates missing_path_parameter
    'path-params': 'off',
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
    // Turn off - duplicates operation_id_case_convention, operation_id_naming_convention
    'operation-operationId': 'off',
    // Turn off - duplicates operation_id_case_convention
    'operation-operationId-valid-in-url': 'off',
    // Enable with same severity as Spectral
    'operation-tags': true,
    // Turn off - duplicates missing_path_parameter
    'path-declarations-must-exist': 'off',
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

    'content-entry-provided': ibmRules.contentEntryProvided,
    'content-entry-contains-schema': ibmRules.contentEntryContainsSchema,
    'ibm-content-type-is-specific': ibmRules.ibmContentTypeIsSpecific,
    'ibm-error-content-type-is-json': ibmRules.ibmErrorContentTypeIsJson,
    'ibm-sdk-operations': ibmRules.ibmSdkOperations,
    'major-version-in-path': ibmRules.majorVersionInPath,
    'missing-required-property': ibmRules.missingRequiredProperty,
    'parameter-schema-or-content': ibmRules.parameterSchemaOrContent,
    'response-error-response-schema': ibmRules.responseErrorResponseSchema,
    'response-example-provided': ibmRules.responseExampleProvided,
    'request-body-object': ibmRules.requestBodyObject,
    'string-boundary': ibmRules.stringBoundary,
    'server-variable-default-value': ibmRules.serverVariableDefaultValue,
    'examples-name-contains-space': ibmRules.examplesNameContainsSpace,
    'prohibit-summary-sentence-style': ibmRules.prohibitSummarySentenceStyle
  }
};
