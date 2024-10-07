/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { ifModifiedSinceHeader } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = ifModifiedSinceHeader;
const ruleId = 'ibm-no-if-modified-since-header';
const expectedSeverity = severityCodes.warning;
const expectedErrorMsg =
  'Operations should support the If-None-Match header parameter instead of If-Modified-Since';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Query parameter named If-Modified-Since', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A query param.',
          name: 'If-Modified-Since',
          required: true,
          in: 'query',
          schema: {
            type: 'string',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Path parameter named If-Modified-Since', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A path param.',
          name: 'If-Modified-Since',
          required: true,
          in: 'path',
          schema: {
            type: 'string',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Header parameter named If-Modified-Since', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'Used for synchronization of resource updates.',
          name: 'If-Modified-Since',
          required: true,
          in: 'header',
          schema: {
            type: 'string',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedErrorMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.parameters.0');
    });
  });
});
