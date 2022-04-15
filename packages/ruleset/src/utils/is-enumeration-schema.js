const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with an `enum` array property containing only strings.
 * It also accounts for the possibility of a composite schema whose composed schemas consistently
 * reflect this indication of being an enumeration schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions or schemas which
 * give no consistent indication of type.
 */
const isEnumerationSchema = schema => {
  return checkCompositeSchemaForConstraint(schema, s => {
    return Array.isArray(s.enum) && s.enum.every(e => typeof e === 'string');
  });
};

module.exports = isEnumerationSchema;
