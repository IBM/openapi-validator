/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { contentTypeHeader } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = contentTypeHeader;
const ruleId = 'ibm-no-content-type-header';
const expectedSeverity = severityCodes.warning;
const expectedErrorMsg =
  'Operations should not explicitly define the Content-Type header parameter';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Query parameter named Content-Type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A query param.',
          name: 'Content-Type',
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

    it('Path parameter named Content-Type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A path param.',
          name: 'Content-Type',
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
    it('Header parameter named Content-Type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'The request body mimetype.',
          name: 'Content-Type',
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
