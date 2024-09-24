/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const path = require('path');
const { getCategories } = require('../../src/scoring-tool/categories');
const readYaml = require('../../src/cli-validator/utils/read-yaml.js');
const rubric = require('../../src/scoring-tool/rubric');
const validateSchema = require('../../src/cli-validator/utils/validate-schema');

const ibmRuleset = require('@ibm-cloud/openapi-ruleset');

describe('scoring-tool rubric tests', function () {
  it('should define entries that have a valid structure', async function () {
    // Read in the rubric entry schema in order to validate each entry.
    const rubricEntrySchema = await readYaml(
      path.join(__dirname, '../../src/schemas/rubric-entry.yaml')
    );

    Object.values(rubric).forEach(entry => {
      expect(validateSchema(entry, rubricEntrySchema)).toHaveLength(0);
    });
  });

  it('should define entries for every non-ignored validator rule', function () {
    const ignoredRules = [
      // These have been labeled as rules that should not
      // have an impact on the score.
      'ibm-no-superfluous-allof',
      'ibm-unevaluated-properties',
      'ibm-no-accept-header',
      'ibm-no-authorization-header',
      'ibm-no-body-for-delete',
      'ibm-no-content-type-header',
      'ibm-no-duplicate-description-with-ref-sibling',
      'ibm-no-optional-properties-in-required-body',
      'ibm-requestbody-name',
      'ibm-schema-type',
      'ibm-sdk-operations',
      'ibm-securityscheme-attributes',
      'ibm-securityschemes',
      'oas2-operation-formData-consume-check',
      'oas2-api-host',
      'oas2-api-schemes',
      'oas2-host-trailing-slash',
      'oas2-operation-security-defined',
      'oas2-valid-schema-example',
      'oas2-valid-media-example',
      'oas2-anyOf',
      'oas2-oneOf',
      'oas2-schema',
      'oas2-unused-definition',
    ];

    Object.keys(ibmRuleset.rules).forEach(rule => {
      if (!ignoredRules.includes(rule) && ibmRuleset.rules[rule] !== 'off') {
        expect(Object.keys(rubric)).toContain(rule);
      }
    });
  });

  it('should only include pre-defined categories', function () {
    const supportedCategories = getCategories();
    const rubricCategories = Object.values(rubric)
      .map(entry => entry.categories)
      .reduce((uniqueCategories, categories) => {
        categories.forEach(c => uniqueCategories.add(c));
        return uniqueCategories;
      }, new Set());

    for (const category of rubricCategories) {
      expect(supportedCategories).toContain(category);
    }
  });
});
