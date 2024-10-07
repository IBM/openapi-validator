/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { deleteBody } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = deleteBody;
const ruleId = 'ibm-no-body-for-delete';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'DELETE operations should not contain a requestBody';

// We need to set this because the rule is now deprecated and disabled.
rule.severity = 'warn';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Delete operation w/a requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
        summary: 'Pour a drink down the drain',
        description: 'Pour a drink down the drain',
        tags: ['TestTag'],
        requestBody: {
          content: {
            'text/html': {
              schema: {
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully poured!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.delete.requestBody'
      );
    });
  });
});
