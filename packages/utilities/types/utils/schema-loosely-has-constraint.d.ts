export = schemaLooselyHasConstraint;
/**
 * This function is a looser adaptation of the `schemaHasConstraint()` function.
 * Here, we process `oneOf` and `anyOf` lists the same as `allOf`, returning `true` if:
 *
 * - a schema has the constraint itself, or
 * - any of the schemas it composes with `allOf` has the constraint, or
 * - any of the schemas it composes with `oneOf` has the constraint, or
 * - any of the schemas it composes with `anyOf` has the constraint
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} hasConstraint a `(schema) => boolean` function to check for a constraint
 * @returns {boolean}
 */
declare function schemaLooselyHasConstraint(schema: object, hasConstraint: Function): boolean;
//# sourceMappingURL=schema-loosely-has-constraint.d.ts.map