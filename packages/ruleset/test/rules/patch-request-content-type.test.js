/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { patchRequestContentType } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = patchRequestContentType;
const ruleId = 'ibm-patch-request-content-type';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'PATCH operations should support content types application/json-patch+json or application/merge-patch+json';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Patch operation uses json-patch mimetype', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.UpdateCarRequest.content = {
        'application/json-patch+json; blah': {
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
    it('Patch operation uses application/json mimetype', async () => {
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
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/json'
      );
    });

    it('Patch operation defines empty content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.UpdateCarRequest.content = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.requestBody.content'
      );
    });

    it('Patch operation defines empty requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.requestBody = {};

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

    it('Patch operation defines no requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/cars/{car_id}'].patch.requestBody;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/cars/{car_id}.patch');
    });
  });
});
