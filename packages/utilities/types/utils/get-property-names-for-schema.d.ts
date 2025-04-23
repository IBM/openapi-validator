export = getPropertyNamesForSchema;
/**
 * Returns an array of property names for a simple or composite schema,
 * optionally filtered by a lambda function.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} propertyFilter a `(propertyName, propertySchema) => boolean` function to perform filtering
 * @returns {Array} property names
 */
declare function getPropertyNamesForSchema(schema: object, propertyFilter?: Function): any[];
//# sourceMappingURL=get-property-names-for-schema.d.ts.map