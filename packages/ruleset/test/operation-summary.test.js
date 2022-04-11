const { operationSummary } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = operationSummary;
const ruleId = 'operation-summary';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Operation "summary" must be present and non-empty string.';

describe('Spectral rule: operation-summary', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Operation summary is missing', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.summary;
      delete testDocument.paths['/v1/movies'].get.summary;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get');
    });

    it('Operation summary is empty-string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.summary = '';
      testDocument.paths['/v1/movies'].get.summary = '';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.summary');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get.summary');
    });

    it('Operation summary is white-space', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.summary = '  ';
      testDocument.paths['/v1/movies'].get.summary = '                  ';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.summary');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get.summary');
    });
  });
});
