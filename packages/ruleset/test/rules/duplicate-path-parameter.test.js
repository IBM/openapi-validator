/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { duplicatePathParameter } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = duplicatePathParameter;
const ruleId = 'ibm-avoid-repeating-path-parameters';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'Common path parameters should be defined on the path object.';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Path param defined in single operation', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].get.parameters = [
        {
          $ref: '#/components/parameters/DrinkIdParam',
        },
      ];
      delete testDocument.paths['/v1/drinks/{drink_id}'].parameters;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Slightly different path params defined in multiple operations', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add same path param to two operations and remove from path item.
      testDocument.paths['/v1/drinks/{drink_id}'].get.parameters = [
        {
          name: 'drink_id',
          description: 'The id of the drink resource.',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            pattern: '[a-zA-Z0-9 ]+',
            minLength: 1,
            maxLength: 30,
          },
        },
      ];
      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
        parameters: [
          {
            name: 'drink_id',
            description: 'An alternate version of the drink_id path param.',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              pattern: '[a-zA-Z0-9 ]+',
              minLength: 3,
              maxLength: 60,
            },
          },
        ],
      };
      delete testDocument.paths['/v1/drinks/{drink_id}'].parameters;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Redundant path params defined in multiple operations', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add same path param to two operations and remove from path item.
      testDocument.paths['/v1/drinks/{drink_id}'].get.parameters = [
        {
          $ref: '#/components/parameters/DrinkIdParam',
        },
      ];
      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
        parameters: [
          {
            $ref: '#/components/parameters/DrinkIdParam',
          },
        ],
      };
      delete testDocument.paths['/v1/drinks/{drink_id}'].parameters;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.parameters.0'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.delete.parameters.0'
      );
    });
    it('Common path param defined on path and one operation', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add redundant path parm to the get operation.
      testDocument.paths['/v1/drinks/{drink_id}'].get.parameters = [
        {
          $ref: '#/components/parameters/DrinkIdParam',
        },
      ];

      // Add a second operation to this path with no path params.
      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.parameters.0'
      );
    });
  });
});
