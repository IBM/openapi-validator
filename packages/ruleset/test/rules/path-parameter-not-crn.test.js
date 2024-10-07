/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { pathParameterNotCRN } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = pathParameterNotCRN;
const ruleId = 'ibm-no-crn-path-parameters';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Path parameters should not be defined as a CRN value';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Query param w/ CRN in description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.VerboseParam.description =
        'this is a CRN value';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Path param w/ crn in name', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.DrinkIdParam.name = 'drink_crn';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0.name'
      );
    });

    it('Path param w/ format=crn', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.schema.format = 'crn';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.schema.format'
      );
    });

    it('Path param w/ pattern="crn..."', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.schema.pattern =
        'crn:[0-9A-F]+';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.schema.pattern'
      );
    });

    it('Path param w/ pattern="^crn..."', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.schema.pattern =
        '^crn:[0-9A-F]+$';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.schema.pattern'
      );
    });

    it('Path param w/ crn-like example value', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.example =
        'crn:88adez-01abdfe';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.example'
      );
    });

    it('Path param w/ crn-like value in "examples" field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.examples = {
        good: {
          description: 'A good example',
          value: '88adez-01abdfe',
        },
        bad: {
          description: 'A bad example',
          value: 'crn:88adez-01abdfe',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.examples.bad.value'
      );
    });

    it('Path param w/ crn-like example value in schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.MovieIdParam.schema.example =
        'crn:88adez-01abdfe';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.parameters.0.schema.example'
      );
    });
  });
});
