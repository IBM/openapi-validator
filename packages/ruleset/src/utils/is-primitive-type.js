/**
 * Returns true if "schema" is a primitive schema.
 * @param {*} schema the schema to check
 * @returns boolean
 */
function isPrimitiveType(schema) {
  return (
    schema.type &&
    ['boolean', 'integer', 'number', 'string'].includes(schema.type)
  );
}

module.exports = isPrimitiveType;
