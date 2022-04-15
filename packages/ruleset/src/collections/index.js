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
  '$.paths[*][*][requestBody].content[*].schema'
];

// A collection of locations where a parameter object might be defined.
// This does not include components.parameters because this collection
// should be used with resolved=true and we want to avoid duplication.
const parameters = [
  '$.paths[*].parameters.[*]',
  '$.paths[*][*].parameters.[*]'
];

const paths = ['$.paths[*]'];

const operations = ['$.paths[*][get,put,post,delete,options,head,patch,trace]'];

module.exports = {
  responseSchemas,
  schemas,
  operations,
  parameters,
  paths
};
