export = schemaHasConstraint;
/**
 * This function will return `true` if all possible variations of a (possibly composite) schema
 * enforce a constraint, as checked by a `(schema) => boolean` function which checks for the
 * constraint on a simple (non-composite) schema. It does this by recursively checking if:
 *
 * - a schema has the constraint itself, or
 * - any of the schemas it composes with `allOf` has the constraint, or
 * - all of the schemas it composes with `oneOf` have the constraint, or
 * - all of the schemas it composes with `anyOf` have the constraint
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Function} hasConstraint a `(schema) => boolean` function to check for a constraint
 * @returns {boolean}
 */
declare function schemaHasConstraint(schema: object, hasConstraint: Function): boolean;
//# sourceMappingURL=schema-has-constraint.d.ts.map