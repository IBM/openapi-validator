/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// A group of predefined "collections" of OpenAPI locations to validate,
// to be re-used by multiple rules.

// A collection of all locations where an operation might exist.
const operations = [`$.paths[*][get,put,post,delete,options,head,patch,trace]`];

// A collection of locations of top-level response schemas
const responseSchemas = [`${operations[0]}[responses][*].content[*].schema`];

// A collection of locations of top-level requestBody schemas.
const requestBodySchemas = [`${operations[0]}[requestBody].content[*].schema`];

// A collection of locations where a JSON Schema object can be *used*.
// Note that this does not include "components.schemas" to avoid duplication.
// this collection should be used in a rule that has "resolved" set to "true".
// we separately validate that all schemas in "components" need to be used.
const schemas = [
  `$.paths[*][parameters][*].schema`,
  `$.paths[*][parameters][*].content[*].schema`,
  `${operations[0]}[parameters][*].schema`,
  `${operations[0]}[parameters,responses][*].content[*].schema`,
  `${operations[0]}.responses[*].headers[*].schema`,
  ...requestBodySchemas,
];

// A collection of locations where a parameter object might be defined.
// This does not include components.parameters because this collection
// should be used with resolved=true and we want to avoid duplication.
const parameters = [
  `$.paths[*].parameters[*]`,
  `${operations[0]}.parameters[*]`,
];

const paths = [`$.paths[*]`];

const patchOperations = [`$.paths[*][patch]`];

// A collection of locations where a response schema could be defined
// within an unresolved API definition.
const unresolvedResponseSchemas = [
  `${operations[0]}.responses[*].content[*].schema`,
  `$.components.responses[*].content[*].schema`,
];

// A collection of locations where a requestBody schema could be defined
// within an unresolved API definition.
const unresolvedRequestBodySchemas = [
  ...requestBodySchemas,
  `$.components.requestBodies[*].content[*].schema`,
];

// A collection of locations where a schema object could be defined
// within an unresolved API definition.
const unresolvedSchemas = [
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
];

const securitySchemes = [`$.components.securitySchemes[*]`];

module.exports = {
  operations,
  parameters,
  patchOperations,
  paths,
  requestBodySchemas,
  responseSchemas,
  schemas,
  securitySchemes,
  unresolvedRequestBodySchemas,
  unresolvedResponseSchemas,
  unresolvedSchemas,
};
