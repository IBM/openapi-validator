const isArraySchema = require('./is-array-schema');
const isBooleanSchema = require('./is-boolean-schema');
const isDateSchema = require('./is-date-schema');
const isDateTimeSchema = require('./is-date-time-schema');
const isDoubleSchema = require('./is-double-schema');
const isEnumerationSchema = require('./is-enumeration-schema');
const isFloatSchema = require('./is-float-schema');
const isInt32Schema = require('./is-int32-schema');
const isInt64Schema = require('./is-int64-schema');
const isIntegerSchema = require('./is-integer-schema');
const isNumberSchema = require('./is-number-schema');
const isObjectSchema = require('./is-object-schema');
const isStringSchema = require('./is-string-schema');

/**
 * An enumeration of non-mutually-exclusive schema types.
 *
 * Types present in this enumeration may expand over time, so consuming code should not assume that
 * it is comprehensive as it currently exists. In general, a type should be included in this
 * enumeration if it requires special handling by a client (for example, if it needs to be mapped
 * to a specific language type or data structure in an SDK).
 */
const SchemaType = {
  ARRAY: Symbol(),
  BOOLEAN: Symbol(),
  DATE: Symbol(),
  DATE_TIME: Symbol(),
  DOUBLE: Symbol(),
  ENUMERATION: Symbol(),
  FLOAT: Symbol(),
  INT32: Symbol(),
  INT64: Symbol(),
  INTEGER: Symbol(),
  NUMBER: Symbol(),
  OBJECT: Symbol(),
  STRING: Symbol(),
  UNKNOWN: Symbol()
};

/**
 * Returns a symbol from SchemaType based on the most specific schema type detected for a schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array. It also does
 * not attempt to account for `type` and `format` defined across composited schemas.
 *
 * WARNING: Code consuming this function should assume that a more specific value for a particular
 * schema might be returned in the future.
 */
const getSchemaType = schema => {
  if (isArraySchema(schema)) {
    return SchemaType.ARRAY;
  } else if (isObjectSchema(schema)) {
    return SchemaType.OBJECT;
  } else if (isBooleanSchema(schema)) {
    return SchemaType.BOOLEAN;
  }
  if (isEnumerationSchema(schema)) {
    // Intentionally checked before string
    return SchemaType.ENUMERATION;
  } else if (isStringSchema(schema)) {
    if (isDateSchema(schema)) {
      return SchemaType.DATE;
    } else if (isDateTimeSchema(schema)) {
      return SchemaType.DATE_TIME;
    } else {
      return SchemaType.STRING;
    }
  } else if (isIntegerSchema(schema)) {
    if (isInt32Schema(schema)) {
      return SchemaType.INT32;
    } else if (isInt64Schema(schema)) {
      return SchemaType.INT64;
    } else {
      return SchemaType.INTEGER;
    }
  } else if (isNumberSchema(schema)) {
    if (isFloatSchema(schema)) {
      return SchemaType.FLOAT;
    } else if (isDoubleSchema(schema)) {
      return SchemaType.DOUBLE;
    } else {
      return SchemaType.NUMBER;
    }
  } else {
    return SchemaType.UNKNOWN;
  }
};

module.exports = { getSchemaType, SchemaType };
