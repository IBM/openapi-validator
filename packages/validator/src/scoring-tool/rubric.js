/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  'ibm-accept-and-return-models': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-anchored-patterns': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['robustness'],
  },
  'ibm-api-symmetry': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'evolution'],
  },
  'ibm-array-attributes': {
    coefficient: 2,
    denominator: 'array-schemas',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-avoid-inline-schemas': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'evolution'],
  },
  'ibm-avoid-multiple-types': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-avoid-property-name-collision': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-avoid-repeating-path-parameters': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-binary-schemas': {
    coefficient: 1,
    denominator: 'binary-schemas',
    categories: ['usability'],
  },
  'ibm-collection-array-property': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-content-contains-schema': {
    coefficient: 20,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-content-type-is-specific': {
    coefficient: 20,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-define-required-properties': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-discriminator-property': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-dont-require-merge-patch-properties': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-enum-casing-convention': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-error-content-type-is-json': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-error-response-schemas': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-etag-header': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-major-version-in-path': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['evolution'],
  },
  /* 'ibm-no-accept-header': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact */
  'ibm-no-ambiguous-paths': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-no-array-of-arrays': {
    coefficient: 20,
    denominator: 'operations',
    categories: ['usability', 'evolution'],
  },
  'ibm-no-array-responses': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['evolution'],
  },
  /* 'ibm-no-authorization-header': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact
  'ibm-no-body-for-delete': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - deprecated */
  'ibm-no-circular-refs': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'security'],
  },
  'ibm-no-consecutive-path-parameter-segments': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability'],
  },
  /* 'ibm-no-content-type-header': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact */
  'ibm-no-crn-path-parameters': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-no-default-for-required-parameter': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  /* 'ibm-no-duplicate-description-with-ref-sibling': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact */
  'ibm-no-if-modified-since-header': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-no-if-unmodified-since-header': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-no-nullable-properties': {
    coefficient: 2,
    denominator: 'object-schemas',
    categories: ['usability', 'robustness'],
  },
  'ibm-no-operation-requestbody': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  /*'ibm-no-optional-properties-in-required-body': { - deprecated, in favor of ibm-no-required-properties-in-optional-body
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['usability', 'robustness'],
  },*/
  'ibm-no-ref-in-example': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-no-required-properties-in-optional-body': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-no-space-in-example-name': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  // 'ibm-no-superfluous-allof' - no impact, can leave out
  'ibm-no-unsupported-keywords': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-openapi-tags-used': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-operation-responses': {
    coefficient: 3,
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-operation-summary': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-operation-summary-length': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-operationid-casing-convention': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-operationid-naming-convention': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-pagination-style': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-parameter-casing-convention': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-parameter-description': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-parameter-order': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-parameter-schema-or-content': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-patch-request-content-type': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-path-segment-casing-convention': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-pattern-properties': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-precondition-headers': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-prefer-token-pagination': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-property-attributes': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-property-casing-convention': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-property-consistent-name-and-type': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-property-description': {
    coefficient: 25,
    denominator: 'schemas',
    categories: ['usability', 'robustness'],
  },
  'ibm-ref-pattern': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-request-and-response-content': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-requestbody-is-object': {
    coefficient: 10,
    denominator: 'operations',
    categories: ['evolution'],
  },
  /* 'ibm-requestbody-name': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['usability'],
  }, - disabled by default */
  'ibm-required-array-properties-in-response': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-resource-response-consistency': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-response-status-codes': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'ibm-schema-casing-convention': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-schema-description': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-schema-keywords': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-schema-naming-convention': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  /* 'ibm-schema-type': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['usability'],
  }, - disabled by default */
  'ibm-schema-type-format': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  /* 'ibm-sdk-operations': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact
  'ibm-securityscheme-attributes': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact
  'ibm-securityschemes': {
    'coefficient': 1,
    'denominator': 'operations',
    'categories': ['],
  }, - no impact */
  'ibm-server-variable-default-value': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-string-attributes': {
    coefficient: 2,
    denominator: 'string-schemas',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'ibm-success-response-example': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-summary-sentence-style': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  // 'ibm-unevaluated-properties' - no impact
  'ibm-unique-parameter-request-property-names': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'ibm-valid-path-segments': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability'],
  },
  'ibm-well-defined-dictionaries': {
    coefficient: 30,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  // Begin Spectral's built-in rules...
  'operation-success-response': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  /*'oas2-operation-formData-consume-check': { // declaring no impact
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },*/
  'operation-operationId-unique': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'operation-parameters': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'evolution'],
  },
  'operation-tag-defined': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'info-contact': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'info-description': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'no-eval-in-markdown': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'no-script-tags-in-markdown': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'openapi-tags': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'operation-description': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'robustness'],
  },
  'operation-operationId': {
    coefficient: 3,
    categories: ['usability', 'robustness', 'evolution'],
  },
  'operation-operationId-valid-in-url': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'robustness', 'evolution'],
  },
  'operation-tags': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'path-params': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'path-declarations-must-exist': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  'path-keys-no-trailing-slash': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'path-not-include-query': {
    coefficient: 3,
    categories: ['usability', 'robustness', 'evolution'],
  },
  'no-$ref-siblings': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'typed-enum': {
    coefficient: 2,
    denominator: 'operations',
    categories: ['usability', 'security', 'robustness', 'evolution'],
  },
  /*'oas2-api-host': { // Spectral rules that are currently marked as 'no impact'
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-api-schemes': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-host-trailing-slash': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-operation-security-defined': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-valid-schema-example': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-valid-media-example': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-anyOf': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-oneOf': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-schema': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas2-unused-definition': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },*/
  'oas3-api-servers': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas3-examples-value-or-externalValue': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas3-operation-security-defined': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas3-server-trailing-slash': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas3-valid-media-example': {
    coefficient: 3,
    denominator: 'operations',
    categories: ['usability'],
  },
  'oas3-valid-schema-example': {
    coefficient: 3,
    denominator: 'schemas',
    categories: ['usability'],
  },
  'oas3-schema': {
    coefficient: 3,
    categories: ['usability'],
  },
  'oas3-unused-component': {
    coefficient: 1,
    denominator: 'operations',
    categories: ['usability'],
  },
  // TODO: consider what 'category' this should really be.
  parser: {
    coefficient: 100,
    denominator: 'operations',
    categories: ['usability'],
  },
};
