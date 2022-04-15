const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` of `string` and `format` of `date-time`.
 * It also accounts for the possibility of a composite schema whose composed schemas consistently
 * reflect this indication of being a date-time schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array. It also does
 * not attempt to account for `type` and `format` defined across composited schemas.
 */
const isDateTimeSchema = schema => {
  // ignores the possibility of type arrays in OAS 3.1
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === 'string' && s.format === 'date-time'
  );
};

module.exports = isDateTimeSchema;
