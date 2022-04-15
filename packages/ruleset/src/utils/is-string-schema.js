const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` property of `string`. It also accounts
 * for the possibility of a composite schema whose composed schemas consistently reflect this
 * indication of being a string schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array.
 */
const isStringSchema = schema => {
  // ignores the possibility of type arrays in OAS 3.1
  return checkCompositeSchemaForConstraint(schema, s => s.type === 'string');
};

module.exports = isStringSchema;
