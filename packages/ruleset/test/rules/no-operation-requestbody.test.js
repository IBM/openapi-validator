/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');
let rule = require('../../src/rules').noOperationRequestBody;

const ruleId = 'ibm-no-operation-requestbody';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'operations should not define a requestBody';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    afterEach(() => {
      jest.resetModules();
      rule = require('../../src/rules').noOperationRequestBody;
    });
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Delete operation w/requestBody - delete not in config', async () => {
      const testDocument = makeCopy(rootDocument);

      // omit 'delete' from the list of methods.
      rule.then.functionOptions.httpMethods = ['get', 'head', 'options'];

      testDocument.paths['/v1/drinks/{drink_id}'].delete = {
        operationId: 'delete_drink',
        summary: 'Pour a drink',
        description: 'Pour a drink down the drain',
        tags: ['TestTag'],
        requestBody: {
          content: {
            'text/html': {
              schema: {
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully poured!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('DELETE operation w/requestBody', async () => {
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
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully poured!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`DELETE ${expectedMsg}`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.delete.requestBody'
      );
    });
    it('GET operation w/requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].get = {
        operationId: 'imagine_drink',
        summary: 'Imagine the drink',
        description: 'Imagine consuming the drink',
        tags: ['TestTag'],
        requestBody: {
          content: {
            'text/html': {
              schema: {
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully imagined!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`GET ${expectedMsg}`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.requestBody'
      );
    });
    it('HEAD operation w/requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].head = {
        operationId: 'evaporate_drink',
        summary: 'Evaporate the drink',
        description: 'Evaporate the drink',
        tags: ['TestTag'],
        requestBody: {
          content: {
            'text/html': {
              schema: {
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully evaporated!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`HEAD ${expectedMsg}`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.head.requestBody'
      );
    });
    it('OPTIONS operation w/requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}'].options = {
        operationId: 'needa_drink',
        summary: 'Need a drink',
        description: 'Need a drink',
        tags: ['TestTag'],
        requestBody: {
          content: {
            'text/html': {
              schema: {
                type: 'string',
              },
            },
          },
        },
        responses: {
          204: {
            description: 'Drink successfully needed!',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`OPTIONS ${expectedMsg}`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.options.requestBody'
      );
    });
    it('POST operation w/requestBody - post in config', async () => {
      const testDocument = makeCopy(rootDocument);

      rule.then.functionOptions.httpMethods = [
        'delete',
        'get',
        'head',
        'options',
        'POST',
      ];

      // No need to change testDocument because there are plenty of post
      // operations with a requestBody :)

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);

      const expectedPaths = [
        'paths./v1/drinks.post.requestBody',
        'paths./v1/movies.post.requestBody',
        'paths./v1/cars.post.requestBody',
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`POST ${expectedMsg}`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
