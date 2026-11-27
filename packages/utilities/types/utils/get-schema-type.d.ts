declare namespace _default {
    export { SchemaType };
    export { getSchemaType };
    export { isArraySchema };
    export { isBinarySchema };
    export { isBooleanSchema };
    export { isByteSchema };
    export { isDateSchema };
    export { isDateTimeSchema };
    export { isDoubleSchema };
    export { isEnumerationSchema };
    export { isFloatSchema };
    export { isInt32Schema };
    export { isInt64Schema };
    export { isIntegerSchema };
    export { isNumberSchema };
    export { isObjectSchema };
    export { isPrimitiveSchema };
    export { isStringSchema };
    export { schemaIsOfType };
}
export default _default;
declare namespace SchemaType {
    let ARRAY: symbol;
    let BINARY: symbol;
    let BOOLEAN: symbol;
    let BYTE: symbol;
    let DATE: symbol;
    let DATE_TIME: symbol;
    let DOUBLE: symbol;
    let ENUMERATION: symbol;
    let FLOAT: symbol;
    let INT32: symbol;
    let INT64: symbol;
    let INTEGER: symbol;
    let NUMBER: symbol;
    let OBJECT: symbol;
    let STRING: symbol;
    let UNKNOWN: symbol;
}
/**
 * Returns a symbol from `SchemaType` based on the most specific schema type detected for a schema.
 *
 * This function is a heuristic and does not attempt to account for contradictions or schemas which
 * give no consistent indication of type. It also does not attempt to account for `type` and
 * `format` defined separately across a composite schema.
 *
 * WARNING: Code consuming this function should assume that a more specific value for a particular
 * schema might be returned in the future.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {symbol} a symbol from `SchemaType`
 */
declare function getSchemaType(schema: object): symbol;
/**
 * Returns `true` for an array schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isArraySchema(schema: object): boolean;
/**
 * Returns `true` for an arbitrary octet sequence binary schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isBinarySchema(schema: object): boolean;
/**
 * Returns `true` for a boolean schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isBooleanSchema(schema: object): boolean;
/**
 * Returns `true` for a base64-encoded byte string schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isByteSchema(schema: object): boolean;
/**
 * Returns `true` for a date schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isDateSchema(schema: object): boolean;
/**
 * Returns `true` for a date-time schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isDateTimeSchema(schema: object): boolean;
/**
 * Returns `true` for a double (IEEE 754 64-bit floating point value) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isDoubleSchema(schema: object): boolean;
/**
 * Returns `true` for a string enumeration schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isEnumerationSchema(schema: object): boolean;
/**
 * Returns `true` for a double (IEEE 754 32-bit floating point value) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isFloatSchema(schema: object): boolean;
/**
 * Returns `true` for an int32 (32-bit signed "short") schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isInt32Schema(schema: object): boolean;
/**
 * Returns `true` for an int64 (64-bit signed "long") schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isInt64Schema(schema: object): boolean;
/**
 * Returns `true` for an integer (32-bit, 64-bit, or ambiguous format) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isIntegerSchema(schema: object): boolean;
/**
 * Returns `true` for a number (32-bit, 64-bit, or ambiguous format floating point) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isNumberSchema(schema: object): boolean;
/**
 * Returns `true` for an object schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isObjectSchema(schema: object): boolean;
/**
 * Returns `true` for a primitive schema (anything encoded as a JSON string, number, or boolean).
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isPrimitiveSchema(schema: object): boolean;
/**
 * Returns `true` for a string schema of any format.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
declare function isStringSchema(schema: object): boolean;
/**
 * Check whether a schema is of a specific type. This means that one of the following must be true:
 * 1. `schema`'s type field is a string and is equal to `type`.
 * 2. `schema`'s type field is a list and contains `type`.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {string} type the type value to check
 * @returns {boolean}
 */
declare function schemaIsOfType(schema: object, type: string): boolean;
//# sourceMappingURL=get-schema-type.d.ts.map