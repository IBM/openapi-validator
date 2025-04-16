/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/* @private */
const operations = [`$.paths[*][get,put,post,delete,options,head,patch,trace]`];
/* @private */
const requestBodySchemas = [`${operations[0]}[requestBody].content[*].schema`];
/* @private */
const responseSchemas = [`${operations[0]}[responses][*].content[*].schema`];
/* @private */
const unresolvedRequestBodySchemas = [
  ...requestBodySchemas,
  `$.components.requestBodies[*].content[*].schema`,
];
/* @private */
const unresolvedResponseSchemas = [
  `${operations[0]}.responses[*].content[*].schema`,
  `$.components.responses[*].content[*].schema`,
];

/**
 * A group of predefined "collections" of OpenAPI locations to validate,
 * to be re-used by multiple rules.
 */
const collections = {
  /**
   * locations of operation definitions
   */
  operations,
  /**
   * locations of parameter definitions; this does not include `components.parameters` because this
   * collection should be used with `resolved` set to `true` and we want to avoid duplication.
   */
  parameters: [`$.paths[*].parameters[*]`, `${operations[0]}.parameters[*]`],
  /**
   * locations of patch operation definitions
   */
  patchOperations: [`$.paths[*][patch]`],
  /**
   * locations of path definitions
   */
  paths: [`$.paths[*]`],
  /**
   * locations of top-level request body schema definitions
   */
  requestBodySchemas,
  /**
   * locations of top-level response schema definitions
   */
  responseSchemas,
  /**
   * locations where schemas are used; this does not include `components.schemas` because this
   * collection should be used with `resolved` set to `true` and we want to avoid duplication.
   */
  schemas: [
    `$.paths[*][parameters][*].schema`,
    `$.paths[*][parameters][*].content[*].schema`,
    `${operations[0]}[parameters][*].schema`,
    `${operations[0]}[parameters][*].content[*].schema`,
    `${operations[0]}.responses[*].headers[*].schema`,
    `${operations[0]}.responses[*].headers[*].content[*].schema`,
    ...requestBodySchemas,
    ...responseSchemas,
  ],
  /**
   * locations of security scheme definitions
   */
  securitySchemes: [`$.components.securitySchemes[*]`],
  /**
   * locations of request body schema definitions within an unresolved API definition
   */
  unresolvedRequestBodySchemas,
  /**
   * locations of response schema definitions within an unresolved API definition
   */
  unresolvedResponseSchemas,
  /**
   * locations of schema definitions could be defined within an unresolved API definition
   */
  unresolvedSchemas: [
    // Named schemas.
    `$.components.schemas[*]`,

    // Request/response schemas.
    ...unresolvedRequestBodySchemas,
    ...unresolvedResponseSchemas,

    // Parameter schemas.
    `$.paths[*].parameters[*].schema`,
    `$.paths[*].parameters[*].content[*].schema`,
    `${operations[0]}.parameters[*].schema`,
    `${operations[0]}.parameters[*].content[*].schema`,
    `$.components.parameters[*].schema`,
    `$.components.parameters[*].content[*].schema`,

    // Header schemas.
    `${operations[0]}.responses[*].headers[*].schema`,
    `${operations[0]}.responses[*].headers[*].content[*].schema`,
    `$.components.headers[*].schema`,
    `$.components.headers[*].content[*].schema`,
    `$.components.responses[*].headers[*].schema`,
    `$.components.responses[*].headers[*].content[*].schema`,
  ],
};

module.exports = collections;
