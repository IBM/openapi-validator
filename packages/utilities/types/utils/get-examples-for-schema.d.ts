export = getExamplesForSchema;
/**
 * Returns an array of examples for a simple or composite schema. For each composed schema, if
 * `schema.examples` is present (and an array), `schema.example` is ignored.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @returns {Array} examples
 */
declare function getExamplesForSchema(schema: object): any[];
//# sourceMappingURL=get-examples-for-schema.d.ts.map