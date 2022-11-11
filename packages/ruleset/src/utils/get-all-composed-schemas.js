const isObject = require('./is-object');

/**
 * Returns an array of all schemas composed into a schema, optionally filtered by a lambda function,
 * and optionally including the schema itself. This function is useful if you need to see across
 * all composed schemas without caring about the exact implication of the schema (such as whether it
 * represents a necessary constraint as in `allOf` or a possible constraint such as in `oneOf`).
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {function} schemaFilter(schema, applicators) - Lambda filter for schemas
 * @param {boolean} includeSelf - Option to include the schema itself (defaults to `true`)
 * @returns {array} - Array of composed schemas
 */
const getAllComposedSchemas = (
  schema,
  schemaFilter = () => true,
  includeSelf = true,
  applicators = []
) => {
  const schemas = [];

  if (!isObject(schema)) {
    return schemas;
  }

  if (includeSelf && schemaFilter(schema, applicators)) {
    schemas.push(schema);
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      for (const applicatorSchema of schema[applicatorType]) {
        schemas.push(
          ...getAllComposedSchemas(applicatorSchema, schemaFilter, true, [
            ...applicators,
            applicatorType
          ])
        );
      }
    }
  }

  return [...new Set(schemas)]; // de-duplicate
};

module.exports = getAllComposedSchemas;
