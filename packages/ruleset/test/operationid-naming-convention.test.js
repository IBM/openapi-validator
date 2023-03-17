/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { operationIdNamingConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = operationIdNamingConvention;
const ruleId = 'ibm-operation-id-naming-convention';
const expectedSeverity = severityCodes.warning;
const expectedMsgPrefix =
  /^operationIds should follow naming convention: operationId verb should be.*$/;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('path has multiple path params, get', async () => {
      const testDocument = makeCopy(rootDocument);

      const newGet = makeCopy(testDocument.paths['/v1/drinks/{drink_id}'].get);
      newGet.operationId = 'check_glass';
      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        get: newGet,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has multiple path params, get', async () => {
      const testDocument = makeCopy(rootDocument);

      const newGet = makeCopy(testDocument.paths['/v1/drinks/{drink_id}'].get);
      newGet.operationId = 'get_glass';
      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        get: newGet,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has single path param not at end, get', async () => {
      const testDocument = makeCopy(rootDocument);

      const newGet = makeCopy(testDocument.paths['/v1/drinks/{drink_id}'].get);
      newGet.operationId = 'anything_goes';
      testDocument.paths['/v1/drinks/{drink_id}/glass'] = {
        get: newGet,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path ends with path param, post', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].post = {
        operationId: 'create_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('no path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].put = {
        operationId: 'replace_drinks',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path ends with path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].put = {
        operationId: 'replace_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has single path param not at end, put', async () => {
      const testDocument = makeCopy(rootDocument);

      // This should not fail as it is not considered to be "resource-oriented".
      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        put: {
          operationId: 'replace_glasses',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has single path param not at end, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        put: {
          operationId: 'set_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has multiple path params, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        put: {
          operationId: 'add_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path ends with path param, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has single path param not at end, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        delete: {
          operationId: 'unset_glasses',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has single path param not at end, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        delete: {
          operationId: 'delete_drink_glasses',
        },
      };

      // Add another path so this API will be resource-oriented.
      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        get: {
          operationId: 'get_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('path has multiple path params, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        delete: {
          operationId: 'remove_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('no path param, get', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'serve_drinks';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*list$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/drinks.get.operationId');
    });

    it('path ends with path param, get', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].get.operationId =
        'consume_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*get$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.operationId'
      );
    });

    it('path has multiple path params, get', async () => {
      const testDocument = makeCopy(rootDocument);

      const newGet = makeCopy(testDocument.paths['/v1/drinks/{drink_id}'].get);
      newGet.operationId = 'empty_glass';
      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        get: newGet,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*get or check$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}/glasses/{glass_id}.get.operationId'
      );
    });
    it('no path param, post', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'mix_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*create$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/drinks.post.operationId');
    });

    it('path ends with path param, post', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].post = {
        operationId: 'top_off_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*create$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.post.operationId'
      );
    });

    it('path ends with path param, patch', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].patch = {
        operationId: 'refill_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*update$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.patch.operationId'
      );
    });

    it('path ends with path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].put = {
        operationId: 'stole_my_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*replace$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.put.operationId'
      );
    });

    it('no path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].put = {
        operationId: 'move_drinks',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*replace$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/drinks.put.operationId');
    });

    it('path ends with path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].put = {
        operationId: 'take_a_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*replace$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.put.operationId'
      );
    });

    it('path has single path param not at end, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        put: {
          operationId: 'smash_drink_glasses',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*replace or set$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}/glasses.put.operationId'
      );
    });

    it('path has multiple path params, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        put: {
          operationId: 'smash_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*replace or add$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}/glasses/{glass_id}.put.operationId'
      );
    });

    it('path ends with path param, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'eliminate_drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*delete$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.delete.operationId'
      );
    });

    it('path has single path param not at end, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses'] = {
        delete: {
          operationId: 'remove_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*delete or unset$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}/glasses.delete.operationId'
      );
    });

    it('path has multiple path params, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}/glasses/{glass_id}'] = {
        delete: {
          operationId: 'smash_drink_glass',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*delete or remove$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}/glasses/{glass_id}.delete.operationId'
      );
    });
  });
});
