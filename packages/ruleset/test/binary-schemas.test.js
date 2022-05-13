const { binarySchemas } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = binarySchemas;
const ruleId = 'binary-schemas';
const expectedSeverity = severityCodes.warning;
const expectedMsgParam =
  'Parameters should not contain binary values (type: string, format: binary).';
const expectedMsgReqBody =
  'Request bodies with JSON content should not contain binary values (type: string, format: binary).';
const expectedMsgResponse =
  'Responses with JSON content should not contain binary values (type: string, format: binary).';

describe('Spectral rule: binary-schemas', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of binary, non-JSON content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].put.requestBody = {
        content: {
          'application/octet-stream': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Nested array of binary, non-JSON content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].get.responses = {
        '200': {
          content: {
            'application/octet-stream': {
              schema: {
                type: 'array',
                items: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Binary schema in non-JSON parameters.content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].put.parameters[1].content = {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Binary parameter.schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].put.parameters[0].schema = {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgParam);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/menu.put.parameters.0.schema'
      );
    });

    it('Binary parameter.content.*.schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].put.parameters[1].content[
        'application/json'
      ].schema = {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgParam);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/menu.put.parameters.1.content.application/json.schema'
      );
    });

    it('Binary requestBody schema, JSON content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].put.requestBody = {
        content: {
          'application/json; charset=utf-8': {
            schema: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgReqBody);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/menu.put.requestBody.content.application/json; charset=utf-8.schema'
      );
    });

    it('Binary response schema, JSON content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/menu'].get.responses = {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/menu.get.responses.200.content.application/json.schema'
      );
    });
  });
});
