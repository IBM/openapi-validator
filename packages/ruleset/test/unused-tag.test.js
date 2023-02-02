const { unusedTag } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = unusedTag;
const ruleId = 'ibm-unused-tag';
const expectedSeverity = severityCodes.warning;

describe('Spectral rule: unused-tag', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Unreferenced tag', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.tags.push({ name: 'UnusedTag' });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'A tag is defined but never used: UnusedTag'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('tags.1');
    });
  });
});
