const isObject = require('./is-object');
const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * Returns `true` if the input is an object with a `type` property of "object" or an object with no
 * `type` property and and a definition of `properties` or `additionalProperties`. It also accounts
 * for the possibility of a composite schema whose composed schemas consistently reflect one of
 * these indications of being an object schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a `type` array.
 */
const isObjectSchema = schema => {
  return checkCompositeSchemaForConstraint(schema, s => {
    if ('type' in s) {
      return s.type === 'object'; // ignores the possibility of type arrays in OAS 3.1
    } else {
      return (
        isObject(s.properties) ||
        s.additionalProperties === true ||
        isObject(s.additionalProperties)
      );
    }
  });
};

module.exports = isObjectSchema;
