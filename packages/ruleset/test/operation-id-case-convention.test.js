const { operationIdCaseConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = operationIdCaseConvention;
const ruleId = 'operation-id-case-convention';
const expectedSeverity = severityCodes.warning;

describe('Spectral rule: operation-id-case-convention', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Non-snake case operationId for excluded operation', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/drinks'].post.operationId = 'CreateDrink';
      testDocument.paths['/v1/drinks'].post['x-sdk-exclude'] = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Upper camel case operationId', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/drinks'].post.operationId = 'CreateDrink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe('Operation ids must be snake case');
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.operationId'
      );
    });
  });
});
