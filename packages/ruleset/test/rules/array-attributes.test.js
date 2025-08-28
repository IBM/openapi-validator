/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { arrayAttributes } = require('../../src/rules');
const { unitTestRule, severityCodes } = require('../test-utils');

const rule = arrayAttributes;
const ruleId = 'ibm-array-attributes';
const expectedSeverity = severityCodes.warning;
const expectedMsgMin = `Array schemas should define a numeric 'minItems' field`;
const expectedMsgMax = `Array schemas should define a numeric 'maxItems' field`;
const expectedMsgItems = `Array schemas must specify the 'items' field`;
const expectedMsgMinMax = `'minItems' cannot be greater than 'maxItems'`;
const expectedMsgEnumArray = `Array schemas should not define an 'enum' field`;
const expectedMsgMinNonArray = `'minItems' should not be defined for a non-array schema`;
const expectedMsgMaxNonArray = `'maxItems' should not be defined for a non-array schema`;
const expectedMsgItemsNonArray = `'items' should not be defined for a non-array schema`;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Array property with min/maxItems in allOf', async () => {
      const input = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            allOf: [
              {
                type: 'array',
                description: 'a description',
                items: {
                  type: 'string',
                },
              },
              {
                type: 'array',
                minItems: 12,
                maxItems: 42,
              },
            ],
          },
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(0);
    });

    it('Schema property uses nested allOf/oneOf with mix/maxItems', async () => {
      const input = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            // At least one of the allOf schemas should have min/maxItems.
            allOf: [
              {
                // Each of the oneOf schemas should have min/maxItems
                oneOf: [
                  {
                    type: 'array',
                    minItems: 45,
                    maxItems: 100000,
                  },
                  {
                    type: 'array',
                    minItems: 100001,
                    maxItems: 100500,
                  },
                ],
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(0);
    });

    it('minItems and maxItems defined', async () => {
      const input = {
        type: 'array',
        minItems: 3,
        maxItems: 4,
        items: {
          type: 'integer',
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(0);
    });

    it('minItems <= maxItems', async () => {
      const input = {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'integer',
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Array property with no min/maxItems', async () => {
      const input = {
        type: 'array',
        items: {
          type: 'string',
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path).toStrictEqual([]);
    });

    it('enum defined for array schema', async () => {
      const input = {
        type: 'array',
        maxItems: 3,
        minItems: 1,
        items: {
          type: 'string',
        },
        enum: [['circle'], ['circle', 'square', 'triangle']],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgEnumArray);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['enum']);
    });

    it('Inline response schema array property with only minItems', async () => {
      const input = {
        description: 'An error response.',
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            minItems: 0,
            description:
              'The array of error entries associated with the error response',
            items: {
              type: 'object',
            },
          },
          trace: {
            description: 'The error trace information.',
            type: 'string',
            format: 'uuid',
          },
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['properties', 'errors']);
    });

    it('Schema property uses allOf without min/maxItems', async () => {
      const input = {
        allOf: [
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          {
            type: 'array',
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path).toStrictEqual([]);
    });

    it('Schema property uses oneOf without min/maxItems', async () => {
      const input = {
        oneOf: [
          {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 0,
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
            maxItems: 5,
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path).toStrictEqual([]);
    });

    it('Schema property uses anyOf without min/maxItems', async () => {
      const input = {
        anyOf: [
          {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 0,
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
            maxItems: 5,
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path).toStrictEqual([]);
    });

    it('Schema property uses nested allOf/oneOf without maxItems', async () => {
      const input = {
        oneOf: [
          {
            allOf: [
              {
                type: 'array',
                minItems: 0,
                maxItems: 4,
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          {
            type: 'array',
            minItems: 0,
            items: {
              type: 'string',
            },
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);
    });

    it('Schema property uses nested allOf/anyOf without minItems', async () => {
      const input = {
        anyOf: [
          {
            allOf: [
              {
                type: 'array',
                minItems: 0,
                maxItems: 4,
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          {
            type: 'array',
            maxItems: 1600,
            items: {
              type: 'string',
            },
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);
    });

    it('Schema without items property', async () => {
      const input = {
        type: 'array',
        minItems: 0,
        maxItems: 50,
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);
    });

    it('allOf element without items property', async () => {
      const input = {
        allOf: [
          {
            type: 'array',
            minItems: 0,
            maxItems: 50,
          },
        ],
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);
    });

    it('additionalProperties schema without items property', async () => {
      const input = {
        type: 'object',
        additionalProperties: {
          type: 'array',
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['additionalProperties']);
    });
    it('minItems > maxItems', async () => {
      const input = {
        type: 'array',

        items: {
          type: 'integer',
        },
        minItems: 5,
        maxItems: 4,
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMinMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([]);
    });

    it('minItems defined for non-array schema', async () => {
      const input = {
        type: 'object',
        minItems: 3,
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMinNonArray);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['minItems']);
    });

    it('maxItems defined for non-array schema', async () => {
      const input = {
        type: 'object',
        maxItems: 3,
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMaxNonArray);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['maxItems']);
    });

    it('items defined for non-array schema', async () => {
      const input = {
        type: 'object',
        items: {
          type: 'integer',
        },
      };

      const results = await unitTestRule(ruleId, rule, input);

      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItemsNonArray);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual(['items']);
    });
  });
});
