/**
 * Copyright 2023 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getSchemaType,
  isObject,
  isArraySchema,
  schemaHasConstraint,
  schemaLooselyHasConstraint,
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

// The graph fragment check is depth-first. Use this stack to
// print the relevant info logs in a sane order.
const infoLogStack = [];

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
      if (variantSchema && isObject(variantSchema)) {
        logger.info(
          `${ruleId}: checking variant schema ${variantSchemaName} against canonical schema ${canonicalSchemaName}`
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
          logger.info(
            `${ruleId}: variant schema ${variantSchemaName} is not a graph fragment of canonical schema ${canonicalSchemaName}`
          );
          errors.push({
            message:
              'Variant schema should be a graph fragment of the canonical schema',
            path: ['components', 'schemas', variantSchemaName],
          });
        } else {
          logger.info(
            `${ruleId}: variant schema ${variantSchemaName} is a graph fragment of canonical schema ${canonicalSchemaName}`
          );
        }
      }
    });
  }

  return errors;
}

/**
 * Determine if the variant schema is indeed a proper graph fragment of the
 * canonical schema, using the following conditions:
 * - The variant does not define any properties that do not exist on the
 *   canonical schema (exists = present and has same type)
 * - The variant does not define any nested schemas (including those defined
 *   by arrays or dictionaries) that aren't themselves graph fragments of
 *   the corresponding canonical schema.
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
    logger.debug(
      `${ruleId}: entering isGraphFragment(${fromApplicator}, ${canonicalPath.join(
        '.'
      )})`
    );
    let result = true;

    // Check for simple type equivalency - if the types are not the same,
    // the graph fragment pattern is violated.
    if (
      !fromApplicator &&
      !canonicalSchemaMeetsConstraint(
        canonical,
        canonicalPath,
        schemaFinder,
        schema => getSchemaType(variant) === getSchemaType(schema)
      )
    ) {
      infoLogStack.push(
        `${ruleId}: variant and canonical schemas are different types`
      );
      result = false;
    }

    // Ensure list schemas also maintain a graph fragment structure.
    if (
      isObject(variant.items) &&
      isArraySchema(variant) &&
      !canonicalSchemaMeetsConstraint(
        canonical,
        canonicalPath,
        schemaFinder,
        (schema, path) =>
          isObject(schema.items) &&
          isGraphFragment(
            variant.items,
            schema.items,
            [...path, 'items'],
            false
          )
      )
    ) {
      infoLogStack.push(
        `${ruleId}: variant is array with schema that is not a graph fragment of canonical items schema`
      );
      result = false;
    }

    // Ensure dictionary schemas also maintain a graph fragment structure
    // (additional properties).
    if (
      variant.additionalProperties &&
      !canonicalSchemaMeetsConstraint(
        canonical,
        canonicalPath,
        schemaFinder,
        (schema, path) =>
          schema.additionalProperties &&
          isGraphFragment(
            variant.additionalProperties,
            schema.additionalProperties,
            [...path, 'additionalProperties'],
            false
          )
      )
    ) {
      infoLogStack.push(
        `${ruleId}: variant is dictionary with an additionalProperties schema that is not a graph fragment of canonical`
      );
      result = false;
    }

    // Ensure dictionary schemas also maintain a graph fragment structure
    // (pattern properties).
    if (
      isObject(variant.patternProperties) &&
      !canonicalSchemaMeetsConstraint(
        canonical,
        canonicalPath,
        schemaFinder,
        (schema, path) =>
          isObject(schema.patternProperties) &&
          // This is a little convoluted but it is enforcing that
          // 1) every pattern in the variant schema is also in canonical
          //    schema, and
          // 2) every patterned schema in the variant must be a graph fragment
          //    of at least one patterned schema in the canonical schema.
          Object.entries(variant.patternProperties).every(
            ([variantPattern, variantPatternSchema]) =>
              Object.keys(schema.patternProperties).includes(variantPattern) &&
              Object.entries(schema.patternProperties).some(
                ([canonPattern, canonPatternSchema]) =>
                  isGraphFragment(
                    variantPatternSchema,
                    canonPatternSchema,
                    [...path, 'patternProperties', canonPattern],
                    false
                  )
              )
          )
      )
    ) {
      infoLogStack.push(
        `${ruleId}: variant is dictionary with a patternProperties schema that is not a graph fragment of canonical`
      );
      result = false;
    }

    // If the variant schema (or sub-schema) has properties, ensure that each
    // property is defined *somewhere* on the corresponding canonical schema
    // (or sub-schema) and ensure it is also a valid graph fragment of the
    // corresponding property in the canonical schema.
    //
    // We use a looser contraint-checking function here because it is
    // sufficient for "one of" or "any of" the canonical schemas to define the
    // property defined on the variant schema, and we need to resolve reference
    // schemas on the fly each time we check the canonical schema for a constraint.
    if (isObject(variant.properties)) {
      for (const [name, prop] of Object.entries(variant.properties)) {
        let propExistsSomewhere = false;

        const valid = canonicalSchemaMeetsConstraint(
          canonical,
          canonicalPath,
          schemaFinder,
          (schema, path) => {
            const exists =
              'properties' in schema && isObject(schema.properties[name]);
            propExistsSomewhere = propExistsSomewhere || exists;

            return (
              exists &&
              isGraphFragment(
                prop,
                schema.properties[name],
                [...path, 'properties', name],
                false
              )
            );
          }
        );

        // Note: Prototype schemas are allowed to define writeOnly properties
        // that don't exist on the canonical schema.
        if (!valid && !(considerWriteOnly && prop.writeOnly)) {
          infoLogStack.push(
            propExistsSomewhere
              ? `${ruleId}: nested object property ${name} is not a graph fragment of canonical property ${name}`
              : `${ruleId}: property '${name}' does not exist on the canonical schema`
          );
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
        infoLogStack.push(
          `${ruleId}: variant schema applicator '${applicator}' is not a graph fragment of the canonical schema`
        );
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
      logger.debug(
        `${ruleId}: checking that variant schema is a proper subset of canonical schema`
      );

      const propertyOmitted = schemaHasConstraint(canonical, c => {
        if (c && isObject(c.properties)) {
          let omitted = false;
          for (const [name, prop] of Object.entries(c.properties)) {
            logger.debug(`${ruleId}: checking canonical property '${name}'`);

            const included = schemaLooselyHasConstraint(
              variant,
              s =>
                'properties' in s &&
                isObject(s.properties[name]) &&
                getSchemaType(s.properties[name]) === getSchemaType(prop)
            );

            logger.debug(
              `${ruleId}: finished checking canonical property '${name}', included=${included}`
            );

            if (!included) {
              omitted = true;
              logger.debug(
                `${ruleId}: canonical property ${name} is NOT present in variant schema`
              );
              break;
            } else {
              logger.debug(
                `${ruleId}: canonical property ${name} is present in variant schema`
              );
            }
          }

          return omitted;
        }
        return false;
      });

      if (propertyOmitted) {
        variantOmitsProperties = true;
      }
      logger.debug(
        `${ruleId}: finished checking for omitted properties, propertyOmitted=${propertyOmitted}`
      );
    } else {
      logger.debug(`${ruleId}: bypassing omitted properties check`);
    }

    logger.debug(`${ruleId}: exiting isGraphFragment, result=${result}`);

    return result;
  }

  // Invoke primary algorithm.
  const variantIsGraphFragment = isGraphFragment(
    variant,
    canonical,
    canonicalPath,
    false
  );

  // Print the logs gathered within the `isGraphFragment` function,
  // in reverse order - it will be coherent for the user.
  while (infoLogStack.length) {
    logger.info(infoLogStack.pop());
  }

  logger.debug(
    `${ruleId}: isGraphFragment() returned [${variantIsGraphFragment},${variantOmitsProperties}]`
  );

  if (!variantOmitsProperties) {
    logger.info(
      `${ruleId}: variant schema properties are not a proper subset of the canonical schema properties (no properties omitted)`
    );
  }

  return variantIsGraphFragment && variantOmitsProperties;
}

/**
 * This is a variation of `schemaHasConstraint` for which, in the case of
 * applicator schemas like `oneOf`, any schema meeting the constraint is
 * sufficient for returning a `true` value, as opposed to all of them
 * needing to meet the constraint.
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
      `replacing reference schema ${schemaName} with canonical version ${canonicalVersion}`
    );
    schema = schemaFinder.allSchemas[canonicalVersion];
    path = ['components', 'schemas', canonicalVersion];
  }

  if (hasConstraint(schema, path)) {
    return true;
  }

  for (const applicator of ['allOf', 'oneOf', 'anyOf']) {
    if (
      Array.isArray(schema[applicator]) &&
      schema[applicator].length > 0 &&
      schema[applicator].reduce(
        (previousResult, currentSchema, index) =>
          canonicalSchemaMeetsConstraint(
            currentSchema,
            [...path, applicator, index.toString()],
            schemaFinder,
            hasConstraint
          ) || previousResult,
        false
      )
    ) {
      return true;
    }
  }

  return false;
}
