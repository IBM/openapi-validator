const { inlineRequestSchema } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = inlineRequestSchema;
const ruleId = 'ibm-inline-request-schema';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'Request body schemas should be defined as a $ref to a named schema.';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'string'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/ non-JSON mimetype', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            description:
              'Inline object schema for a non-JSON requestBody; should be ignored',
            type: 'object',
            properties: {
              test_prop: {
                type: 'string'
              }
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/ non-JSON mimetype (referenced requestBody)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.CarRequest.content = {
        'text/html': {
          schema: {
            description:
              'Inline object schema for a non-JSON requestBody; should be ignored',
            type: 'object',
            properties: {
              test_prop: {
                type: 'string'
              }
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline array schema w/primitive items', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: {
          type: 'integer'
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Ref sibling pattern', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            description:
              'This is an alternate description for the Drink schema.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Composed primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'string'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Inline object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = testDocument.components.schemas.Drink;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            type: 'object',
            properties: {
              prop1: {
                type: 'string'
              }
            }
          },
          {
            properties: {
              prop2: {
                type: 'string'
              }
            }
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema in referenced requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.CarRequest.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            type: 'object',
            properties: {
              prop1: {
                type: 'string'
              }
            }
          },
          {
            properties: {
              prop2: {
                type: 'string'
              }
            }
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.requestBodies.CarRequest.content.application/json.schema'
      );
    });

    it('NOT ref sibling pattern', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            type: 'object',
            description:
              'This is an alternate description for the Drink schema.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema via multiple references', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            $ref: '#/components/schemas/Car'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema via oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        oneOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            description:
              'This is an alternate description for the Drink schema.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema with altered required properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            required: ['type']
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline array schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: testDocument.components.schemas.Drink
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.items'
      );
    });
  });
});
