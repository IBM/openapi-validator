const validateComposedSchemas = require('./validate-composed-schemas');
const validateNestedSchemas = require('./validate-nested-schemas');

/*
 * Performs validation on a schema and all of its subschemas.
 *
 * Subschemas include property schemas (for an object schema), item schemas (for an array schema),
 * and applicator schemas (such as those in an `allOf` or `oneOf` property), plus all subschemas
 * of those schemas.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {array} path - Path array for the provided schema.
 * @param {function} validate - Validate function.
 * @returns {array} - Array of validation errors.
 */
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
