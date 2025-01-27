/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas } = require('@stoplight/spectral-rulesets');

// Spectral's "typed-enum" rule matches any object that happens to have a
// "type" and "enum" field on it. This results in false positives when
// APIs have metadata, like SDK generation metadata, contained in an
// extension, that contains objects with these keys are are not schemas.
// This solves the issue by replacing the "given" field with our "schemas"
// collection, modified to only give schemas with a "type" and "enum" field,
// while otherwise maintaining Spectral's implementation of the rule.
const typedEnum = oas.rules['typed-enum'];
typedEnum.given = schemas.map(s =>
  s.replace(
    '[*].schema',
    '[?(@.schema && @.schema.type && @.schema.enum)].schema'
  )
);

module.exports = typedEnum;
