const isObject = require('./is-object');
const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` property of "array" or an object with no
 * `type` property and an `items` property containing an object. It also accounts for the
 * possibility of a composite schema whose composed schemas consistently reflect one of these
 * indications of being an array schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array.
 */
const isArraySchema = schema => {
  return checkCompositeSchemaForConstraint(schema, s => {
    if ('type' in s) {
      return s.type === 'array'; // ignores the possibility of type arrays in OAS 3.1
    } else {
      return isObject(s.items);
    }
  });
};

module.exports = isArraySchema;
