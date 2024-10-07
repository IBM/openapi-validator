/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { mergePatchProperties } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = mergePatchProperties;
const ruleId = 'ibm-dont-require-merge-patch-properties';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'A JSON merge-patch requestBody should have no required properties';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Patch requestBody not merge-patch', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.UpdateCarRequest.content = {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Car',
          },
          examples: {
            RequestExample: {
              $ref: '#/components/examples/CarExample',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Patch requestBody schema defines required properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.UpdateCarRequest.content = {
        'application/merge-patch+json; charset=utf-8': {
          schema: {
            $ref: '#/components/schemas/Car',
          },
          examples: {
            RequestExample: {
              $ref: '#/components/examples/CarExample',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch requestBody schema defines minProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CarPatch.minProperties = 1;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch requestBody defines required properties in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['CarPatchProperties'] =
        testDocument.components.schemas['CarPatch'];
      testDocument.components.schemas['CarPatch'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatchProperties',
          },
          {
            required: ['make', 'model'],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch requestBody defines minProperties in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['CarPatchProperties'] =
        testDocument.components.schemas['CarPatch'];
      testDocument.components.schemas['CarPatch'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatchProperties',
          },
          {
            minProperties: 1,
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch requestBody defines required in nested allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['CarPatchProperties'] =
        testDocument.components.schemas['CarPatch'];
      testDocument.components.schemas['CarPatch'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatchProperties',
          },
          {
            allOf: [
              {
                allOf: [
                  {
                    required: ['make', 'model'],
                  },
                ],
              },
            ],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch requestBody defines minProperties in nested allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['CarPatchProperties'] =
        testDocument.components.schemas['CarPatch'];
      testDocument.components.schemas['CarPatch'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatchProperties',
          },
          {
            allOf: [
              {
                allOf: [
                  {
                    minProperties: 1,
                  },
                ],
              },
            ],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });
  });
});
