/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const isObject = require('./is-object');
const schemaHasConstraint = require('./schema-has-constraint');

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
  UNKNOWN: Symbol('unknown'),
};

/**
 * Returns a symbol from SchemaType based on the most specific schema type detected for a schema.
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

/**
 * Returns true iff 'schema' is of type 'type'.
 * This means that one of the following must be true:
 * 1. schema's 'type' field is a string and is equal to the specified type.
 * 2. schema's 'type' field is a list and contains the specified type.
 * @param {*} schema the schema to be checked
 * @param {*} type the desired type value to check for
 * @returns boolean true if 'schema' is of the specified type, false otherwise.
 */
const schemaIsOfType = (schema, type) => {
  return (
    'type' in schema &&
    ((typeof schema.type === 'string' && schema.type === type) ||
      (Array.isArray(schema.type) && schema.type.includes(type)))
  );
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
 * composes an `object`- and `integer`-type schemas with `allOf`).
 * They also do not account for `type` and `format` values defined separately across a
 * composite schema. (I.e., a `format` value is only considered meaningful in the context of a
 * `type` value for which it is valid, in the same simple (non-composite) schema.
 */

/**
 * Returns `true` for an array schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isArraySchema = schema => {
  return schemaHasConstraint(schema, s => {
    return schemaIsOfType(s, 'array') || (isObject(s.items) && !('type' in s));
  });
};

/**
 * Returns `true` for an arbitrary octet sequence binary schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isBinarySchema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'string') && s.format === 'binary'
  );
};

/**
 * Returns `true` for a boolean schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isBooleanSchema = schema => {
  return schemaHasConstraint(schema, s => schemaIsOfType(s, 'boolean'));
};

/**
 * Returns `true` for a base64-encoded byte string schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isByteSchema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'string') && s.format === 'byte'
  );
};

/**
 * Returns `true` for a date schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isDateSchema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'string') && s.format === 'date'
  );
};

/**
 * Returns `true` for a date-time schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isDateTimeSchema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'string') && s.format === 'date-time'
  );
};

/**
 * Returns `true` for a double (IEEE 754 64-bit floating point value) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isDoubleSchema = schema => {
  // also ignores `type` and `format` defined in separately composited schemas
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'number') && s.format === 'double'
  );
};

/**
 * Returns `true` for a string enumeration schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isEnumerationSchema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'string') && Array.isArray(s.enum)
  );
};

/**
 * Returns `true` for a double (IEEE 754 32-bit floating point value) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isFloatSchema = schema => {
  // also ignores `type` and `format` defined in separately composited schemas
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'number') && s.format === 'float'
  );
};

/**
 * Returns `true` for an int32 (32-bit signed "short") schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isInt32Schema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'integer') && s.format === 'int32'
  );
};

/**
 * Returns `true` for an int64 (64-bit signed "long") schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isInt64Schema = schema => {
  return schemaHasConstraint(
    schema,
    s => schemaIsOfType(s, 'integer') && s.format === 'int64'
  );
};

/**
 * Returns `true` for an integer (32-bit, 64-bit, or ambiguous format) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isIntegerSchema = schema => {
  return schemaHasConstraint(schema, s => schemaIsOfType(s, 'integer'));
};

/**
 * Returns `true` for a number (32-bit, 64-bit, or ambiguous format floating point) schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isNumberSchema = schema => {
  return schemaHasConstraint(schema, s => schemaIsOfType(s, 'number'));
};

/**
 * Returns `true` for an object schema.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isObjectSchema = schema => {
  return schemaHasConstraint(schema, s => {
    return (
      schemaIsOfType(s, 'object') ||
      (!('type' in s) &&
        (isObject(s.properties) ||
          s.additionalProperties === true ||
          isObject(s.additionalProperties) ||
          isObject(s.patternProperties)))
    );
  });
};

/**
 * Returns `true` for a string schema of any format.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isStringSchema = schema => {
  return schemaHasConstraint(schema, s => schemaIsOfType(s, 'string'));
};

/**
 * Returns `true` for a primitive schema (anything encoded as a JSON string, number, or boolean).
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 or 3.1 schema object.
 * @returns {boolean}
 */
const isPrimitiveSchema = schema => {
  // This implementation should remain stable when additional specific types are added
  return (
    isStringSchema(schema) ||
    isNumberSchema(schema) ||
    isIntegerSchema(schema) ||
    isBooleanSchema(schema)
  );
};

module.exports = {
  SchemaType,
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
  isStringSchema,
  schemaIsOfType,
};
