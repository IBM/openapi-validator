/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { optionalRequestBody } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = optionalRequestBody;
const ruleId = 'ibm-optional-requestbody';
const expectedSeverity = severityCodes.info;
const expectedMsg =
  'An optional requestBody with required properties should probably be required';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('requestBody.required not present', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.requestBodies['CarRequest'].required;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/cars.post.requestBody');
    });

    it('requestBody.required explicitly false', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies['UpdateCarRequest'].required =
        false;
      testDocument.components.schemas['CarPatch'].required = ['make', 'model'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody'
      );
    });

    it('requestBody.schema required field in an allOf child', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies['UpdateCarRequest'] = {
        required: false,
        content: {
          'application/merge-patch+json': {
            schema: {
              allOf: [
                {
                  $ref: '#/components/schemas/Car',
                },
              ],
            },
            examples: {
              RequestExample: {
                $ref: '#/components/examples/CarExample',
              },
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
        'paths./v1/cars/{car_id}.patch.requestBody'
      );
    });
  });
});
