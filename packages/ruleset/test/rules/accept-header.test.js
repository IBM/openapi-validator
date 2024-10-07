/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { acceptHeader } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = acceptHeader;
const ruleId = 'ibm-no-accept-header';
const expectedSeverity = severityCodes.warning;
const expectedErrorMsg =
  'Operations should not explicitly define the Accept header parameter';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it.each(['3.0.0', '3.1.0'])('Clean spec', async function (oasVersion) {
      const testDocument = makeCopy(rootDocument);
      testDocument.openapi = oasVersion;
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Query parameter named Accept', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A query param.',
          name: 'Accept',
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

    it('Path parameter named Accept', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          description: 'A path param.',
          name: 'Accept',
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
    it.each(['3.0.0', '3.1.0'])(
      'Header parameter named Accept',
      async function (oasVersion) {
        const testDocument = makeCopy(rootDocument);
        testDocument.openapi = oasVersion;

        testDocument.paths['/v1/drinks'].parameters = [
          {
            description: 'The expected response mimetype.',
            name: 'Accept',
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
      }
    );
  });
});
