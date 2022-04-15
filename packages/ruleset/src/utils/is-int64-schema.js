const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` of `integer` and `format` of `int64`. It
 * also accounts for the possibility of a composite schema whose composed schemas consistently
 * reflect this indication of being a 64-bit integer schema.
 *
 * NOTE: This is checking for a specific format of "int64` which indicates a 64-bit signed integer.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array. It also does
 * not attempt to account for `type` and `format` defined across composited schemas.
 */
const isInt64Schema = schema => {
  // ignores the possibility of type arrays in OAS 3.1
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === 'integer' && s.format === 'int64'
  );
};

module.exports = isInt64Schema;
