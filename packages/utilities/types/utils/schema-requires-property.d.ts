export = schemaRequiresProperty;
/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * require a property with the specified name. Note that this method may not behave as expected
 * for OpenAPI documents where a `required` property is not defined under the `properties` keyword.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {object} propertyName name of the object schema property to check for
 * @returns {boolean}
 */
declare function schemaRequiresProperty(schema: object, propertyName: object): boolean;
//# sourceMappingURL=schema-requires-property.d.ts.map