// a group of predefined "collections" of OpenAPI locations to validate
// helpful when the same group of locations needs to be used by multiple rules

// a collection of locations where a JSON Schema object can be *used*.
//
// note that this does not include "components.schemas" to avoid duplication.
// this collection should be used in a rule that has "resolved" set to "true".
// we separately validate that all schemas in "components" need to be used.
const schemas = [
  '$.paths[*][parameters][*].schema',
  '$.paths[*][parameters][*].content[*].schema',
  '$.paths[*][*][parameters][*].schema',
  '$.paths[*][*][parameters,responses][*].content[*].schema',
  '$.paths[*][*][requestBody].content[*].schema'
];

module.exports = {
  schemas
};
