const { operationIdNamingConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = operationIdNamingConvention;
const ruleId = 'operation-id-naming-convention';
const expectedSeverity = severityCodes.warning;
const expectedMsgPrefix = /^operationIds should follow naming convention: operationId verb should be.*$/;

describe('Spectral rule: operation-id-naming-convention', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('no path param, post', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'mix_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*add or create$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/drinks.post.operationId');
    });

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

    it('path ends with path param, delete', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'eliminate_drink'
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

    it('path ends with path param, patch', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].patch = {
        operationId: 'refill_drink'
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

    it('path ends with path param, post', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].post = {
        operationId: 'top_off_drink'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toMatch(expectedMsgPrefix);
      expect(r.message).toMatch(/^.*update$/);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.post.operationId'
      );
    });

    it('path ends with path param, put', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].put = {
        operationId: 'stole_my_drink'
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
  });
});
