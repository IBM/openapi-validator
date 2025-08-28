export namespace SchemaType {
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
export function getSchemaType(schema: object): symbol;
/**
 * Returns `true` for an array schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isArraySchema(schema: object): boolean;
/**
 * Returns `true` for an arbitrary octet sequence binary schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isBinarySchema(schema: object): boolean;
/**
 * Returns `true` for a boolean schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isBooleanSchema(schema: object): boolean;
/**
 * Returns `true` for a base64-encoded byte string schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isByteSchema(schema: object): boolean;
/**
 * Returns `true` for a date schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isDateSchema(schema: object): boolean;
/**
 * Returns `true` for a date-time schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isDateTimeSchema(schema: object): boolean;
/**
 * Returns `true` for a double (IEEE 754 64-bit floating point value) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isDoubleSchema(schema: object): boolean;
/**
 * Returns `true` for a string enumeration schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isEnumerationSchema(schema: object): boolean;
/**
 * Returns `true` for a double (IEEE 754 32-bit floating point value) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isFloatSchema(schema: object): boolean;
/**
 * Returns `true` for an int32 (32-bit signed "short") schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isInt32Schema(schema: object): boolean;
/**
 * Returns `true` for an int64 (64-bit signed "long") schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isInt64Schema(schema: object): boolean;
/**
 * Returns `true` for an integer (32-bit, 64-bit, or ambiguous format) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isIntegerSchema(schema: object): boolean;
/**
 * Returns `true` for a number (32-bit, 64-bit, or ambiguous format floating point) schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isNumberSchema(schema: object): boolean;
/**
 * Returns `true` for an object schema.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isObjectSchema(schema: object): boolean;
/**
 * Returns `true` for a primitive schema (anything encoded as a JSON string, number, or boolean).
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isPrimitiveSchema(schema: object): boolean;
/**
 * Returns `true` for a string schema of any format.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {boolean}
 */
export function isStringSchema(schema: object): boolean;
/**
 * Check whether a schema is of a specific type. This means that one of the following must be true:
 * 1. `schema`'s type field is a string and is equal to `type`.
 * 2. `schema`'s type field is a list and contains `type`.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {string} type the type value to check
 * @returns {boolean}
 */
export function schemaIsOfType(schema: object, type: string): boolean;
//# sourceMappingURL=get-schema-type.d.ts.map