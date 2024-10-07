/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { noRefInExample } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = noRefInExample;
const ruleId = 'ibm-no-ref-in-example';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'The use of $ref is not valid within an example field';

// To enable debug logging in the rule function, copy this statement to an it() block:
//    LoggerFactory.getInstance().addLoggerSetting(ruleId, 'debug');
// and uncomment this import statement:
// const LoggerFactory = require('../src/utils/logger-factory');

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('requestBody example without $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].example = {
        name: 'coke',
        type: 'soda',
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('response example without $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].example = {
        name: 'coke',
        type: 'soda',
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('schema example without $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink.example = {
        name: 'coke',
        type: 'soda',
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('parameter example without $ref (schema)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.parameters[0].example = 'start1';
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('parameter example without $ref (content)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.parameters[0] = {
        in: 'query',
        name: 'start',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
            example: 'start1',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('requestBody example with $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].example = {
        $ref: '#/components/schemas/Error',
      };

      const expectedPaths = [
        'paths./v1/drinks.post.requestBody.content.application/json.example.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('response example with $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].example = {
        $ref: '#/components/schemas/Error',
      };

      const expectedPaths = [
        'paths./v1/drinks.post.responses.201.content.application/json.example.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('schema example with $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink.example = {
        $ref: '#/components/schemas/Error',
      };

      const expectedPaths = ['components.schemas.Drink.example.$ref'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('parameter example with $ref (schema)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.parameters[0].example = {
        $ref: '#/components/schemas/Error',
      };

      const expectedPaths = ['paths./v1/drinks.get.parameters.0.example.$ref'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('parameter example with $ref (content)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.parameters[0] = {
        in: 'query',
        name: 'start',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
            example: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      };

      const expectedPaths = [
        'paths./v1/drinks.get.parameters.0.content.application/json.example.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('requestBody example with nested $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].example = {
        name: 'Root Beer',
        type: 'soda',
        nested_stuff: {
          $ref: '#/components/schemas/Error',
        },
      };

      const expectedPaths = [
        'paths./v1/drinks.post.requestBody.content.application/json.example.nested_stuff.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('response example with nested $ref', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].example = {
        name: 'Root Beer',
        type: 'soda',
        stuff: {
          nested_stuff: {
            more_nested_stuff: {
              $ref: '#/components/schemas/Error',
            },
          },
          foo: 'bar',
        },
      };

      const expectedPaths = [
        'paths./v1/drinks.post.responses.201.content.application/json.example.stuff.nested_stuff.more_nested_stuff.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('parameter example with nested $ref (content)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.parameters[0] = {
        in: 'query',
        name: 'start',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
            example: {
              name: 'Root Beer',
              type: 'soda',
              $ref: '#/components/schemas/Error',
              stuff: {
                nested_stuff: {
                  more_nested_stuff: {
                    $ref: '#/components/schemas/Error',
                  },
                },
                foo: {
                  bar: 'baz',
                  $ref: {
                    $ref: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
            },
          },
        },
      };

      const expectedPaths = [
        'paths./v1/drinks.get.parameters.0.content.application/json.example.$ref',
        'paths./v1/drinks.get.parameters.0.content.application/json.example.stuff.nested_stuff.more_nested_stuff.$ref',
        'paths./v1/drinks.get.parameters.0.content.application/json.example.stuff.foo.$ref',
        'paths./v1/drinks.get.parameters.0.content.application/json.example.stuff.foo.$ref.$ref',
        'paths./v1/drinks.get.parameters.0.content.application/json.example.stuff.foo.$ref.$ref.$ref',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(5);
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
