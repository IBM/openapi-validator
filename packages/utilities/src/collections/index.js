// A group of predefined "collections" of OpenAPI locations to validate,
// to be re-used by multiple rules.

// A collection of locations of top-level response schemas
const responseSchemas = ['$.paths[*][*][responses][*].content[*].schema'];

// A collection of locations where a JSON Schema object can be *used*.
// Note that this does not include "components.schemas" to avoid duplication.
// this collection should be used in a rule that has "resolved" set to "true".
// we separately validate that all schemas in "components" need to be used.
const schemas = [
  '$.paths[*][parameters][*].schema',
  '$.paths[*][parameters][*].content[*].schema',
  '$.paths[*][*][parameters][*].schema',
  '$.paths[*][*][parameters,responses][*].content[*].schema',
  '$.paths[*][*].responses[*].headers[*].schema',
  '$.paths[*][*][requestBody].content[*].schema'
];

// A collection of locations where a parameter object might be defined.
// This does not include components.parameters because this collection
// should be used with resolved=true and we want to avoid duplication.
const parameters = [
  '$.paths[*].parameters[*]',
  '$.paths[*][get,put,post,delete,options,head,patch,trace].parameters[*]'
];

const paths = ['$.paths[*]'];

const operations = ['$.paths[*][get,put,post,delete,options,head,patch,trace]'];

const patchOperations = ['$.paths[*][patch]'];

// A collection of locations where a response schema could be defined
// within an unresolved API definition.
const unresolvedResponseSchemas = [
  '$.paths[*][*].responses[*].content[*].schema',
  '$.components.responses[*].content[*].schema'
];

// A collection of locations where a requestBody schema could be defined
// within an unresolved API definition.
const unresolvedRequestBodySchemas = [
  '$.paths[*][*].requestBody.content[*].schema',
  '$.components.requestBodies[*].content[*].schema'
];

// A collection of locations where a schema object could be defined
// within an unresolved API definition.
const unresolvedSchemas = [
  // Named schemas.
  '$.components.schemas[*]',

  // Request/response schemas.
  ...unresolvedRequestBodySchemas,
  ...unresolvedResponseSchemas,

  // Parameter schemas.
  '$.paths[*].parameters[*].schema',
  '$.paths[*].parameters[*].content[*].schema',
  '$.paths[*][*].parameters[*].schema',
  '$.paths[*][*].parameters[*].content[*].schema',
  '$.components.parameters[*].schema',
  '$.components.parameters[*].content[*].schema',

  // Header schemas.
  '$.paths[*][*].responses[*].headers[*].schema',
  '$.paths[*][*].responses[*].headers[*].content[*].schema',
  '$.components.headers[*].schema',
  '$.components.headers[*].content[*].schema',
  '$.components.responses[*].headers[*].schema',
  '$.components.responses[*].headers[*].content[*].schema'
];

const securitySchemes = ['$.components.securitySchemes[*]'];

module.exports = {
  responseSchemas,
  operations,
  patchOperations,
  parameters,
  paths,
  unresolvedRequestBodySchemas,
  unresolvedResponseSchemas,
  unresolvedSchemas,
  schemas,
  securitySchemes
};
