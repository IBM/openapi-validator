const isObject = require('./is-object');
const checkCompositeSchemaForConstraint = require('./check-composite-schema-for-constraint');

/**
 * An enumeration of non-mutually-exclusive schema types.
 *
 * Types present in this enumeration may expand over time, so consuming code should not assume that
 * it is comprehensive as it currently exists. In general, a type should be included in this
 * enumeration if it requires special handling by a client (for example, if it needs to be mapped
 * to a specific language type or data structure in an SDK).
 */
const SchemaType = {
  ARRAY: Symbol('array'),
  BINARY: Symbol('binary'),
  BOOLEAN: Symbol('boolean'),
  BYTE: Symbol('byte'),
  DATE: Symbol('date'),
  DATE_TIME: Symbol('date-time'),
  DOUBLE: Symbol('double'),
  ENUMERATION: Symbol('enumeration'),
  FLOAT: Symbol('float'),
  INT32: Symbol('int32'),
  INT64: Symbol('int64'),
  INTEGER: Symbol('integer'),
  NUMBER: Symbol('number'),
  OBJECT: Symbol('object'),
  STRING: Symbol('string'),
  UNKNOWN: Symbol('unknown')
};

const JSONSchemaType = {
  [SchemaType.ARRAY]: 'array',
  [SchemaType.BINARY]: 'string',
  [SchemaType.BOOLEAN]: 'boolean',
  [SchemaType.BYTE]: 'string',
  [SchemaType.DATE]: 'string',
  [SchemaType.DATE_TIME]: 'string',
  [SchemaType.DOUBLE]: 'number',
  [SchemaType.ENUMERATION]: 'string',
  [SchemaType.FLOAT]: 'number',
  [SchemaType.INT32]: 'integer',
  [SchemaType.INT64]: 'integer',
  [SchemaType.INTEGER]: 'integer',
  [SchemaType.NUMBER]: 'number',
  [SchemaType.OBJECT]: 'object',
  [SchemaType.STRING]: 'string'
};

const JSONSchemaFormat = {
  [SchemaType.BINARY]: 'binary',
  [SchemaType.BYTE]: 'byte',
  [SchemaType.DATE]: 'date',
  [SchemaType.DATE_TIME]: 'date-time',
  [SchemaType.DOUBLE]: 'double',
  [SchemaType.FLOAT]: 'float',
  [SchemaType.INT32]: 'int32',
  [SchemaType.INT64]: 'int64'
};

/**
 *] Returns a symbol from SchemaType based on the most specific schema type detected for a schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions, schemas which
 * give no consistent indication of type, or OAS 3.1 schemas which use a type array. It also does
 * not attempt to account for `type` and `format` defined separately across a composite schema.
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
  } else if (isStringSchema(schema)) {
    if (isBinarySchema(schema)) {
      return SchemaType.BINARY;
    } else if (isByteSchema(schema)) {
      return SchemaType.BYTE;
    } else if (isDateSchema(schema)) {
      return SchemaType.DATE;
    } else if (isDateTimeSchema(schema)) {
      return SchemaType.DATE_TIME;
    } else if (isEnumerationSchema(schema)) {
      // Intentionally checked before a generic string, but after explicit string formats
      return SchemaType.ENUMERATION;
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

/*
 * The following functions employ heuristics to determine the logical type of a schema. Schema types
 * as defined by these functions are not exclusive (for example, a `float` is also `number`). These
 * functions account for composite schemas that consistently reflect a single type.
 *
 * A composed schema that might or not be of a given type will return `false` for that type. Even
 * when a schema returns `true` for a given type, the schema may not be following best practices
 * for its typing. For example, a schema which has an `items` property and no explicit `type` will
 * return true for `isArraySchema()`, even though it is a best practice to define an
 * explicit `type`.
 *
 * These functions do not attempt to account for contradictions (for example, a schema which
 * composes an `object`- and `integer`-type schemas with `allOf`), or use OAS 3.1 `type` arrays.
 * They also do not account for `type` and `format` values defined separately across a
 * composite schema. (I.e., a `format` value is only considered meaningful in the context of a
 * `type`, value for which it is valid, in the same simple (non-composite) schema.
 */

/**
 * Returns `true` for an array schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isArraySchema = schema => {
  return checkCompositeSchemaForConstraint(schema, s => {
    if ('type' in s) {
      return s.type === JSONSchemaType[SchemaType.ARRAY]; // ignores the possibility of type arrays in OAS 3.1
    } else {
      return isObject(s.items);
    }
  });
};

/**
 * Returns `true` for an arbitrary octet sequence binary schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isBinarySchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.BINARY] &&
      s.format === JSONSchemaFormat[SchemaType.BINARY]
  );
};

/**
 * Returns `true` for a boolean schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isBooleanSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === JSONSchemaType[SchemaType.BOOLEAN]
  );
};

/**
 * Returns `true` for a base64-encoded byte string schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isByteSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.BYTE] &&
      s.format === JSONSchemaFormat[SchemaType.BYTE]
  );
};

/**
 * Returns `true` for a date schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isDateSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.DATE] &&
      s.format === JSONSchemaFormat[SchemaType.DATE]
  );
};

/**
 * Returns `true` for a date-time schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isDateTimeSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.DATE] &&
      s.format === JSONSchemaFormat[SchemaType.DATE_TIME]
  );
};

/**
 * Returns `true` for a double (IEEE 754 64-bit floating point value) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isDoubleSchema = schema => {
  // also ignores `type` and `format` defined in separately composited schemas
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.DOUBLE] &&
      s.format === JSONSchemaFormat[SchemaType.DOUBLE]
  );
};

/**
 * Returns `true` for a string enumeration schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isEnumerationSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.ENUMERATION] && Array.isArray(s.enum)
  );
};

/**
 * Returns `true` for a double (IEEE 754 32-bit floating point value) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isFloatSchema = schema => {
  // also ignores `type` and `format` defined in separately composited schemas
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.FLOAT] &&
      s.format === JSONSchemaFormat[SchemaType.FLOAT]
  );
};

/**
 * Returns `true` for an int32 (32-bit signed "short") schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isInt32Schema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.INT32] &&
      s.format === JSONSchemaFormat[SchemaType.INT32]
  );
};

/**
 * Returns `true` for an int64 (64-bit signed "long") schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isInt64Schema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s =>
      s.type === JSONSchemaType[SchemaType.INT64] &&
      s.format === JSONSchemaFormat[SchemaType.INT64]
  );
};

/**
 * Returns `true` for an integer (32-bit, 64-bit, or ambiguous format) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isIntegerSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === JSONSchemaType[SchemaType.INTEGER]
  );
};

/**
 * Returns `true` for a number (32-bit, 64-bit, or ambiguous format floating point) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isNumberSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === JSONSchemaType[SchemaType.NUMBER]
  );
};

/**
 * Returns `true` for an object schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isObjectSchema = schema => {
  return checkCompositeSchemaForConstraint(schema, s => {
    if ('type' in s) {
      return s.type === JSONSchemaType[SchemaType.OBJECT]; // ignores the possibility of type arrays in OAS 3.1
    } else {
      return (
        isObject(s.properties) ||
        s.additionalProperties === true ||
        isObject(s.additionalProperties)
      );
    }
  });
};

/**
 * Returns `true` for a string schema of any format.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @returns {boolean}
 */
const isStringSchema = schema => {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s.type === JSONSchemaType[SchemaType.STRING]
  );
};

/**
 * Returns true if "schema" is a primitive schema (string, integer, number, boolean)
 * @param {*} schema the schema to check
 * @returns boolean
 */
function isPrimitiveSchema(s) {
  const primitiveTypes = [
    SchemaType.BOOLEAN,
    SchemaType.BYTE,
    SchemaType.DOUBLE,
    SchemaType.ENUMERATION,
    SchemaType.FLOAT,
    SchemaType.INT32,
    SchemaType.INT64,
    SchemaType.INTEGER,
    SchemaType.NUMBER,
    SchemaType.STRING
  ];

  const type = getSchemaType(s);
  return primitiveTypes.includes(type);
}

module.exports = {
  SchemaType,
  JSONSchemaType,
  JSONSchemaFormat,
  getSchemaType,
  isArraySchema,
  isBinarySchema,
  isBooleanSchema,
  isByteSchema,
  isDateSchema,
  isDateTimeSchema,
  isDoubleSchema,
  isEnumerationSchema,
  isFloatSchema,
  isInt32Schema,
  isInt64Schema,
  isIntegerSchema,
  isNumberSchema,
  isObjectSchema,
  isPrimitiveSchema,
  isStringSchema
};
