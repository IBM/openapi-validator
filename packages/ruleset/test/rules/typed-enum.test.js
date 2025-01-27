/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { typedEnum } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = typedEnum;
const ruleId = 'typed-enum';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId} (modified)`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    // Spectral's rule, on its own, would not pass this test due to
    // the fact that it looks at the whole spec for anything with a
    // "type" and an "enum" field.
    it('Ignore seemingly-violating non-schema objects', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument['x-sdk-apiref'] = {
        type: 'int64',
        enum: [
          'this is based on real, internal metadata',
          'that spectral would inappropriately flag',
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    // This duplicates Spectral's negative test for this rule.
    it('Schema enum field contains values that do not match the type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          schema: {
            type: 'integer',
            enum: [1, 'a string!', 3, 'and another one!'],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedResults = [
        {
          message: 'Enum value "a string!" must be "integer".',
          path: 'paths./v1/drinks.parameters.0.schema.enum.1',
        },
        {
          message: 'Enum value "and another one!" must be "integer".',
          path: 'paths./v1/drinks.parameters.0.schema.enum.3',
        },
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);

        const { message, path } = expectedResults[i];
        expect(results[i].message).toBe(message);
        expect(results[i].path.join('.')).toBe(path);
      }
    });
  });
});
