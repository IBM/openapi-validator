/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { parameterOrder } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = parameterOrder;
const ruleId = 'ibm-parameter-order';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'Required parameters should appear before optional parameters';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Required params listed after optional param', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add two required params to the "list_drinks" operation.
      const newParams = [
        {
          name: 'filter',
          in: 'query',
          description: 'A string used to filter the results.',
          required: true,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'max_pages',
          in: 'query',
          description: 'The max number of pages to return.',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ];
      testDocument.paths['/v1/drinks'].get.parameters.push(...newParams);

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.parameters.2'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.get.parameters.3'
      );
    });

    it('Required referenced param listed after optional params', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add a new named parameter.
      testDocument.components.parameters.FilterParam = {
        name: 'filter',
        in: 'query',
        description: 'A string used to filter the results.',
        required: true,
        schema: {
          type: 'string',
        },
      };

      testDocument.paths['/v1/drinks'].get.parameters.push({
        $ref: '#/components/parameters/FilterParam',
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.parameters.2'
      );
    });
  });
});
