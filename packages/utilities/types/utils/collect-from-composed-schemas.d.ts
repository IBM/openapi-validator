export = collectFromComposedSchemas;
/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */
/**
 * Returns an array of items collected by the provided `collector(schema) => item[]` function for a
 * simple or composite schema, and deduplicates primitives in the result. The collector function is
 * not run for `null` or `undefined` schemas.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} collector a `(schema) => item[]` function to collect items from each simple schema
 * @param {boolean} includeSelf collect from the provided schema in addition to its composed schemas (defaults to `true`)
 * @param {boolean} includeNot collect from schemas composed with `not` (defaults to `false`)
 * @returns {Array} collected items
 */
declare function collectFromComposedSchemas(schema: object, collector: Function, includeSelf?: boolean, includeNot?: boolean): any[];
//# sourceMappingURL=collect-from-composed-schemas.d.ts.map