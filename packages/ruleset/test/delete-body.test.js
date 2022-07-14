const { deleteBody } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = deleteBody;
const ruleId = 'delete-body';
const expectedSeverity = severityCodes.warning;
const expectedMsg = '"delete" operation should not contain a requestBody.';

describe('Spectral rule: delete-body', () => {
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
                type: 'string'
              }
            }
          }
        },
        responses: {
          '204': {
            description: 'Drink successfully poured!'
          },
          '400': {
            $ref: '#/components/responses/BarIsClosed'
          }
        }
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
