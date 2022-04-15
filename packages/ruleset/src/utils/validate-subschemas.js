const validateComposedSchemas = require('./validate-composed-schemas');
const validateNestedSchemas = require('./validate-nested-schemas');

// Subschemas include property schemas (for an object schema), item schemas
// (for an array schema), and applicator schemas (such as those in an allOf,
// anyOf, or oneOf property), plus all subschemas of those schemas.

const validateSubschemas = (schema, path, validate) => {
  return validateNestedSchemas(
    schema,
    path,
    (s, p) => validateComposedSchemas(s, p, validate, true, true),
    true,
    true
  );
};

module.exports = validateSubschemas;
