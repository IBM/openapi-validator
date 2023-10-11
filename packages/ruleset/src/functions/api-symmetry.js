/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getSchemaType,
  isObject,
  isObjectSchema,
  isArraySchema,
  schemaHasConstraint,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  LoggerFactory,
  computeRefsAtPaths,
  getCanonicalSchemaForPath,
  getResourceOrientedPaths,
  getSchemaNameAtPath,
} = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - ibm-request-and-response-content: all relevant success responses
 *   define content objects
 *
 * - ibm-content-contains-schema: the content objects define schemas
 *
 * - ibm-avoid-inline-schemas: all schemas are named (defined with references)
 *
 * - ibm-schema-casing-convention: schema names use upper camel case
 *
 * - ibm-schema-naming-convention: schemas have appropriate, purpose-based names
 */

module.exports = function apiSymmetry(apidef, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkApiForSymmetry(apidef, context.documentInventory.graph.nodes);
};

/**
 * This function checks for most of the API Handbook's rules about schema
 * symmetry in APIs. Namely, the check verifies that "Summary", "Prototype",
 * and "Patch" schemas are all proper "graph fragments" of their corresponding
 * canonical schema. The API Handbook defines a graph fragment this way:
 * "A graph fragment schema has the same structure as its canonical schema with
 * some properties omitted from the schema or from any nested object schemas."
 *
 * @param {*} apidef the entire, resolved API definition as an object
 * @param {*} nodes the spectral-computed graph nodes mapping paths to referenced schemas
 * @returns an array containing the violations found or [] if no violations
 */
function checkApiForSymmetry(apidef, nodes) {
  const pathToReferencesMap = computeRefsAtPaths(nodes);
  const resourceOrientedPaths = getResourceOrientedPaths(apidef);

  if (Object.keys(resourceOrientedPaths).length === 0) {
    logger.debug(`${ruleId}: no resource-oriented paths found, skipping rule`);
  }

  const errors = [];

  for (const specificPath of Object.values(resourceOrientedPaths)) {
    logger.debug(`${ruleId}: found resource-specific path: "${specificPath}"`);

    const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
      getCanonicalSchemaForPath(specificPath, apidef, pathToReferencesMap, {
        logger,
        ruleId,
      });

    // If we can't find the canonical schema,
    // don't perform the rest of the checks.
    if (!canonicalSchema) {
      continue;
    }

    // Check to ensure all relevant schema variants are proper graph fragments
    // of the canonical schema.
    ['Summary', 'Prototype', 'Patch'].forEach(variantType => {
      const variantSchemaName = `${canonicalSchemaName}${variantType}`;
      const variantSchema = apidef.components.schemas[`${variantSchemaName}`];
      if (variantSchema && isObjectSchema(variantSchema)) {
        logger.info(
          `${ruleId}: Checking variant schema ${variantSchemaName} against canonical schema:`
        );
        if (
          !checkForGraphFragmentPattern(
            variantSchema,
            canonicalSchema,
            canonicalSchemaPath.split('.'),
            variantType === 'Prototype',
            {
              refMap: pathToReferencesMap,
              allSchemas: apidef.components.schemas,
            }
          )
        ) {
          logger.debug(
            `${ruleId}: determined that ${variantSchemaName} is not a proper graph fragment of ${canonicalSchemaName}`
          );
          errors.push({
            message:
              'Variant schema should be a graph fragment of the canonical schema',
            path: ['components', 'schemas', variantSchemaName],
          });
        }
      }
    });
  }

  return errors;
}

/**
 * Determine if the variant schema is indeed a proper graph fragment of the
 * canonical schema, using the following conditions:
 * - The variant does not define additional or pattern properties
 * - The variant does not define any properties that do not exist on the
 *   canonical schema (exists = present and has same type)
 * - The variant omits at least one property from the canonical schema
 *
 * @param {object} variant - the variant schema to check
 * @param {object} canonical - the canonical schema to check against
 * @param {array} canonicalPath - array of JSON path segments leading to canonical schema
 * @param {boolean} considerWriteOnly - whether or not to take writeOnly into account
 * @param {object} schemaFinder - an object holding data to help find canonical schema versions
 *                    refMap - map of paths to schema references
 *                    allSchemas - all of the schemas in components
 * @returns {boolean} true if the variant is a proper graph fragment
 */
function checkForGraphFragmentPattern(
  variant,
  canonical,
  canonicalPath,
  considerWriteOnly,
  schemaFinder
) {
  let variantOmitsProperties = false;

  // The function is wrapped in a partial so that we can track `variantOmitsProperties`
  // across the entire schema without overriding it during recursive invocations of the
  // graph fragment checker.

  function isGraphFragment(variant, canonical, canonicalPath, fromApplicator) {
    let result = true;

    // A variant schema cannot allow extraneous properties and still be
    // an explicit graph fragment of the canonical schema.
    if (variant.additionalProperties) {
      logger.info(
        `${ruleId}: schema defines 'additionalProperties' - it is not a proper graph fragment`
      );
      result = false;
    }
    if (variant.patternProperties) {
      logger.info(
        `${ruleId}: schema defines 'patternProperties' - it is not a proper graph fragment`
      );
      result = false;
    }

    // If the variant schema (or sub-schema) has properties, ensure that each
    // property is defined *somewhere* on the corresponding canonical schema
    // (or sub-schema) and has the same, specific type.
    //
    // We use a custom, looser contraint-checking function here because it is
    // sufficient for "one of" or "any of" the canonical schemas to define the
    // property defined on the variant schema, and we need to resolve reference
    // schemas on the fly each time we check the canonical schema for a constraint.
    if (isObject(variant.properties)) {
      for (const [name, prop] of Object.entries(variant.properties)) {
        const valid = canonicalSchemaMeetsConstraint(
          canonical,
          canonicalPath,
          schemaFinder,
          c =>
            'properties' in c &&
            isObject(c.properties[name]) &&
            getSchemaType(c.properties[name]) === getSchemaType(prop)
        );

        // Note: Prototype schemas are allowed to define writeOnly properties
        // that don't exist on the canonical schema.
        if (!valid && !(considerWriteOnly && prop.writeOnly)) {
          logger.info(
            `${ruleId}: property '${name}' does not exist on the canonical schema`
          );
          result = false;
        }

        // Ensure nested schemas are also graph fragments of the corresponding
        // nested schemas in the canonical schema.
        if (
          isObjectSchema(prop) &&
          !canonicalSchemaMeetsConstraint(
            canonical,
            canonicalPath,
            schemaFinder,
            s =>
              // Note that these first two conditions are guaranteed to be met at
              // least once by the first call to `canonicalSchemaMeetsConstraint`
              'properties' in s &&
              isObject(s.properties[name]) &&
              isGraphFragment(
                prop,
                s.properties[name],
                [...canonicalPath, 'properties', name],
                false
              )
          )
        ) {
          result = false;
        }

        // Ensure lists of schemas also maintain a graph fragment structure.
        if (
          isArraySchema(prop) &&
          isObjectSchema(prop.items) &&
          !canonicalSchemaMeetsConstraint(
            canonical,
            canonicalPath,
            schemaFinder,
            s =>
              // Note that these first two conditions are guaranteed to be met at
              // least once by the first call to `canonicalSchemaMeetsConstraint`
              'properties' in s &&
              isObject(s.properties[name]) &&
              isObject(s.properties[name].items) &&
              isGraphFragment(
                prop.items,
                s.properties[name].items,
                [...canonicalPath, 'properties', name, 'items'],
                false
              )
          )
        ) {
          result = false;
        }
      }
    }

    // All applicator schemas of the schema (or sub-schema) variant should be valid
    // graph fragments of the corresponding canonical schema (or sub-schema).
    ['allOf', 'oneOf', 'anyOf'].forEach(applicator => {
      if (
        Array.isArray(variant[applicator]) &&
        variant[applicator].length > 0 &&
        !variant[applicator].reduce(
          (previousResult, v) =>
            previousResult &&
            isGraphFragment(v, canonical, canonicalPath, true),
          true
        )
      ) {
        result = false;
      }
    });

    // To be a proper graph fragment, at least one property needs to be omitted
    // from the schema structure. Check to make sure this is the case.
    //
    // For this, variant schemas need to be taken as a whole (as opposed to
    // looking at each applicator schema individually, if they exist) so  we
    // skip this check if we're currently processing a variant applicator
    // schema.
    //
    // If we've already determined that the variant schema omits at least one
    // property, we don't need to re-perform this check anymore.
    //
    // Note: we don't bother checking for reference schemas here because there
    // should be differences other than omitting non-reference properties.

    if (!fromApplicator && !variantOmitsProperties) {
      const variantIncludesAll = schemaHasConstraint(canonical, c => {
        if (c && isObject(c.properties)) {
          let allAreIncluded = true;
          for (const [name, prop] of Object.entries(c.properties)) {
            const included = schemaHasConstraint(
              variant,
              s =>
                'properties' in s &&
                isObject(s.properties[name]) &&
                getSchemaType(s.properties[name]) === getSchemaType(prop)
            );

            if (!included) {
              allAreIncluded = false;
              break;
            }
          }

          return allAreIncluded;
        }
        return false;
      });

      if (!variantIncludesAll) {
        variantOmitsProperties = true;
      }
    }

    return result;
  }

  // Invoke primary algorithm.
  const variantIsGraphFragment = isGraphFragment(
    variant,
    canonical,
    canonicalPath,
    false
  );

  if (!variantOmitsProperties) {
    logger.info(
      `${ruleId}: schema does not omit any properties in the canonical schema - it is not a proper graph fragment`
    );
  }

  return variantIsGraphFragment && variantOmitsProperties;
}

/**
 * This is a variation of `schemaHasConstraint` for which, in the case of
 * applicator schemas like `oneOf`, any schema meeting the constraint is
 * sufficient for returning a `true` value, as opposed to all of them
 * needing the meet the constraint.
 */
function canonicalSchemaMeetsConstraint(
  schema,
  path,
  schemaFinder,
  hasConstraint
) {
  if (!isObject(schema)) {
    return false;
  }

  // First check if the canonical version of the current schema is actually
  // a reference to a "Reference" schema. This is allowed but we need to
  // check for "graph-fragment-ness" using the canonical version of that
  // Reference schema.
  const schemaName = getSchemaNameAtPath(path.join('.'), schemaFinder.refMap);

  // Use "slice" to remove the "Reference" appendix we guaranteed to be there.
  // If we find the canonical schema, use it for the current function invocation,
  // otherwise proceed as usual.
  if (
    schemaName &&
    schemaName.endsWith('Reference') &&
    schemaFinder.allSchemas[schemaName.slice(0, -9)]
  ) {
    const canonicalVersion = schemaName.slice(0, -9);
    logger.debug(
      `Replacing reference schema ${schemaName} with canonical version ${canonicalVersion}`
    );
    schema = schemaFinder.allSchemas[canonicalVersion];
    path = ['components', 'schemas', canonicalVersion];
  }

  if (hasConstraint(schema)) {
    return true;
  }

  for (const applicator of ['allOf', 'oneOf', 'anyOf']) {
    if (
      Array.isArray(schema[applicator]) &&
      schema[applicator].length > 0 &&
      schema[applicator].reduce(
        (previousResult, currentSchema, index) =>
          previousResult ||
          canonicalSchemaMeetsConstraint(
            currentSchema,
            [...path, applicator, index.toString()],
            schemaFinder,
            hasConstraint
          ),
        false
      )
    ) {
      return true;
    }
  }

  return false;
}
