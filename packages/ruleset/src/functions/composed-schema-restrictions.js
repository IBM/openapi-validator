const {
  validateSubschemas,
  getPropertySchemasByName,
  getSchemaType,
  isObjectSchema,
  isArraySchema,
  isEnumerationSchema,
  isObject,
  SchemaType
} = require('../utils');

module.exports = function(schema, options, { path }) {
  return validateSubschemas(schema, path, composedSchemaRestrictions);
};

/**
 * Checks to make sure properties across a composed object schema have types that are deemed
 * compatible for modeling that schema.
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function composedSchemaRestrictions(schema, path) {
  const errors = [];

  // Only object schemas have properties
  if (isObjectSchema(schema)) {
    // Collects all composed property schemas indexed by the name of the property they define
    const schemasByName = getPropertySchemasByName(schema);

    for (const propertyName in schemasByName) {
      // The reducer will result in a `false` sentinel if two schemas for the same property
      // are not deemed compatible
      if (
        schemasByName[propertyName].reduce(schemaCompatibilityReducer) === false
      ) {
        errors.push({
          message: `SDK generation may fail due to incompatible types for property across composite object schema: ${propertyName}`,
          path
        });
      }
    }
  }

  return errors;
}

/**
 * Reducer for an array of schemas; for each pair of schemas returns one of them if they're deemed
 * compatible and a `false` sentinel otherwise. The `false` sentinel is guaranteed to propagate.
 *
 * @param {*} left the "left" schema in the comparison
 * @param {*} right the "right" schema in the comparison
 * @returns a schema for the next comparison if the two are compatible, `false` otherwise
 */
function schemaCompatibilityReducer(left, right) {
  return getComparandum(left) === getComparandum(right) ? left : false;
}

/**
 * Returns the value appropriate to compare a schema to another schema. This is dependent on type.
 * - For indeterminate schemas, deem incomparable and return a unique value
 * - For object schemas, deem compatible only for an exact match and return the schema itself
 * - For array schemas, deem compatible if their items are compatible (recursive)
 * - For enumeration schemas, deem them compatible with strings
 * - For all other schemas, deem them compatible with schemas of the same derived type and return it
 *
 * @param {*} schema the schema from which to derive a "comparandum" to compare with other schemas
 * @returns a "comparandum" value to compare with other schemas
 */
function getComparandum(schema) {
  if (!isObject(schema) || getSchemaType(schema) === SchemaType.UNKNOWN) {
    // not compatible with any other schema
    return Symbol();
  }
  if (isObjectSchema(schema)) {
    // only compatible with same exact schema
    return schema;
  } else if (isArraySchema(schema)) {
    // compatible with other arrays whose values are compatible
    return getComparandum(schema.items);
  } else if (isEnumerationSchema(schema)) {
    // compatible with all strings
    return SchemaType.STRING;
  } else {
    return getSchemaType(schema);
  }
}
