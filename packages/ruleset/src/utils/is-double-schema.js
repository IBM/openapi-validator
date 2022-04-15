const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` of `number` and `format` of `double`. It
 * also accounts for the possibility of a composite schema whose composed schemas consistently
 * reflect this indication of being a double schema.
 *
 * NOTE: This is checking for a specific format of "double" which indicates a 64-bit floating point
 * value as defined by IEEE 754.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array. It also does
 * not attempt to account for `type` and `format` defined across composited schemas.
 */
const isDoubleSchema = schema => {
  // ignores the possibility of type arrays in OAS 3.1
  // also ignores `type` and `format` defined in separately composited schemas
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === 'number' && s.format === 'double'
  );
};

module.exports = isDoubleSchema;
