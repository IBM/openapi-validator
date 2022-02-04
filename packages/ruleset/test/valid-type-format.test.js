const { validTypeFormat } = require('../src/rules');
const { rootDocument, testRule } = require('./utils');

const rule = validTypeFormat;
const ruleId = 'valid-type-format';

describe('Spectral rule: valid-type-format', () => {
  describe('Should not yield errors', () => {
    it('should not error with a clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {});
});
