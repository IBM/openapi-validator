/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * These are the allowable attributes that may appear alongside a $ref within a schema that fits the
 * "ref sibling" pattern.
 * Attention: this list should be kept in sync with the IBMDefaultCodegen.schemaFitsRefSiblingsPattern()
 * function in the SDK generator.
 */
const SupportedRefSiblingAttributes = ['description', 'example', 'nullable'];

/**
 * Returns true iff "schema" is an example of the SDK Generator's "ref sibling"
 * pattern whereby a schema $ref can be "combined" with certain additional attributes,
 * like this:
 *   components:
 *     schemas:
 *       Foo:
 *         properties:
 *           bar:
 *             allOf:
 *               - $ref: '#/components/schemas/Bar'
 *               - description: This is the bar property in the Foo schema!
 * This effectively defines the "bar" property as an instance of the Bar schema,
 * while overriding the description from the Bar schema with a more specific
 * description.
 * Attention: the logic in this function should be kept in sync with the
 * IBMDefaultCodegen.schemaFitsRefSiblingsPattern() function in the SDK generator.
 *
 * @param {*} schema the schema to check
 * @return boolean true if "schema" is a ref sibling example, false otherwise
 */
function isRefSiblingSchema(schema) {
  const allOf = schema && schema.allOf;
  if (
    !allOf ||
    !Array.isArray(allOf) ||
    !allOf.length ||
    allOf.length > 2 ||
    schema.anyOf ||
    schema.oneOf
  ) {
    return false;
  }

  // The first allOf element must be a $ref.
  const schema1 = allOf[0];
  if (!schema1 || !schema1.$ref) {
    return false;
  }

  if (allOf.length > 1) {
    // If there is a second allOf element, it must contain only "supported" attributes.
    const schema2 = allOf[1];
    if (!schema2 || schema2.$ref) {
      return false;
    }

    if (!containsOnlySupportedAttributes(schema2)) {
      return false;
    }
  } else {
    // If no second allOf element, then "schema" must contain only "supported" attributes
    // in addition to the allOf list, and there must be at least one such attribute present.

    // Make a copy of "schema" and remove its allOf list.
    const s = JSON.parse(JSON.stringify(schema));
    delete s.allOf;

    if (!containsOnlySupportedAttributes(s)) {
      return false;
    }

    if (!Object.keys(s).length) {
      return false;
    }
  }

  return true;
}

/**
 * Returns true iff "schema" contains only fields that are supported
 * ref sibling attributes
 * @param {} schema the schema to check
 * @returns boolean
 */
function containsOnlySupportedAttributes(schema) {
  const attrNames = Object.keys(schema);
  for (const attrName of attrNames) {
    if (!SupportedRefSiblingAttributes.includes(attrName)) {
      return false;
    }
  }

  return true;
}

module.exports = isRefSiblingSchema;
