/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { acceptAndReturnModels } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = acceptAndReturnModels;
const ruleId = 'ibm-accept-and-return-models';
const expectedSeverity = severityCodes.error;
const expectedMessage =
  'Request and response bodies must be models - their schemas must define `properties`';

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

    // Non-JSON content is captured in the root doc but adding this test to be explicit.
    it('Content is non-JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'text/plain': {
          schema: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Content is not an object', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        description: 'should be an object but that is caught elsewhere',
        items: {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    describe('Request bodies', () => {
      it('Schema has no defined properties - empty', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.MoviePrototype = {
          type: 'object',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(2);

        const expectedPaths = [
          'paths./v1/movies.post.requestBody.content.application/json.schema',
          'paths./v1/movies/{movie_id}.put.requestBody.content.application/json.schema',
        ];

        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedMessage);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('Schema has no defined properties - only additional properties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.MoviePrototype = {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(2);

        const expectedPaths = [
          'paths./v1/movies.post.requestBody.content.application/json.schema',
          'paths./v1/movies/{movie_id}.put.requestBody.content.application/json.schema',
        ];

        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedMessage);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('Schema has no defined properties - properties entry is empty', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.CarPatch = {
          type: 'object',
          properties: {},
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);

        const expectedPaths = [
          'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema',
        ];

        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedMessage);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });
  });
});
