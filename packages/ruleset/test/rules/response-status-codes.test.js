/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { responseStatusCodes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = responseStatusCodes;
const ruleId = 'ibm-response-status-codes';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('101 with no 2xx codes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses = {
        101: {
          description: 'protocol-switching response',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST non-"create" w/201', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST non-"create" w/202', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';
      testDocument.paths['/v1/drinks'].post.responses['202'] = {
        description: 'Request to create new resource was accepted',
      };
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST non-"create" with no sibling path', async () => {
      const testDocument = makeCopy(rootDocument);

      // Make the create operation seem incorrect with only a 200 status code.
      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';
      testDocument.paths['/v1/drinks'].post.responses['200'] =
        testDocument.paths['/v1/drinks'].post.responses['201'];
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      // Remove the sibling path so "pour_drink" isn't considered a "create" operation.
      delete testDocument.paths['/v1/drinks/{drink_id}'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST "create" with no responses', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove all the responses for the "create" operation.
      delete testDocument.paths['/v1/drinks'].post.responses;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('non-POST "create" w/201', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';
      testDocument.paths['/v1/drinks'].get.responses['201'] =
        testDocument.paths['/v1/drinks'].get.responses['200'];
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('non-POST "create" w/202', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';
      testDocument.paths['/v1/drinks'].get.responses['202'] = {
        description: 'Request to create new resource was accepted',
      };
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('"create" operation returns 204, and so does corresponding GET (no body representation)', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks/{drink_id}'].get.responses['200'];
      testDocument.paths['/v1/drinks/{drink_id}'].get.responses['204'] = {
        description: 'Resource has no body representation',
      };

      delete testDocument.paths['/v1/drinks'].post.responses['201'];
      testDocument.paths['/v1/drinks'].post.responses['204'] = {
        description: 'Resource has no body representation',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PUT operation may create a resource (defines a 201)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies/{movie_id}'].put.responses['201'] =
        testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];
      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PUT operation is asynchronous (defines a 202)', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];
      testDocument.paths['/v1/movies/{movie_id}'].put.responses['202'] = {
        description: 'Accepted, processing...',
        content: {
          'application/json': {
            schema: {
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'failed', 'completed'],
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PUT operation returns 204 w/GET that also returns 204', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];
      testDocument.paths['/v1/movies/{movie_id}'].put.responses['204'] = {
        description: 'Accepted, processing...',
      };
      delete testDocument.paths['/v1/movies/{movie_id}'].get.responses['200'];
      testDocument.paths['/v1/movies/{movie_id}'].get.responses['204'] = {
        description: 'Accepted, processing...',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PATCH operation is asynchronous (defines a 202)', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/cars/{car_id}'].patch.responses['200'];
      testDocument.paths['/v1/cars/{car_id}'].patch.responses['202'] = {
        description: 'Accepted, processing...',
        content: {
          'application/json': {
            schema: {
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'failed', 'completed'],
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PATCH operation returns 301 with response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'remote_region',
            message: 'The requested resource is in a different region',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('422 status code should be 400', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['422'] =
        testDocument.paths['/v1/drinks'].post.responses['400'];
      delete testDocument.paths['/v1/drinks'].post.responses['400'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation responses should use status code 400 instead of 422 for invalid request payloads'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.422'
      );
    });

    it('302 status code should be 303 or 307', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['302'] = {
        description: 'response for "Found"',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[1].message).toBe(
        'Operation responses should use status code 303 or 307 instead of 302'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.302'
      );
    });

    it('101 status code along with 2xx codes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['101'] = {
        description: 'protocol switcheroo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation responses should not include status code 101 when success status codes (2xx) are present'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.101'
      );
    });

    it('204 status code with response content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses['204'] =
        testDocument.paths['/v1/drinks'].get.responses['200'];
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'A 204 response must not include a response body; use a different status code for responses with content'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.204.content'
      );
    });

    it('No success status codes', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation responses should include at least one success status code (2xx)'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.get.responses');
    });

    it('No success status codes for PUT - should return one warning', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation responses should include at least one success status code (2xx)'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.put.responses'
      );
    });

    it('PUT operation returns 204 with no GET that also returns 204', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];
      testDocument.paths['/v1/movies/{movie_id}'].put.responses['204'] = {
        description: 'Accepted, processing...',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'PUT operations should return a 200, 201, or 202 status code'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.put.responses'
      );
    });

    it('No success status codes for PATCH - should return one warning', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/cars/{car_id}'].patch.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation responses should include at least one success status code (2xx)'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.responses'
      );
    });

    it('non-POST "create" operation with no 201/202 status code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        "A 201 or 202 status code should be returned by a 'create' operation"
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.get.responses');
    });

    it('POST non-"create" operation with no 201/202 status code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';
      testDocument.paths['/v1/drinks'].post.responses['200'] =
        testDocument.paths['/v1/drinks'].post.responses['201'];
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        "A 201 or 202 status code should be returned by a 'create' operation"
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.responses');
    });

    it('operation returns 202 plus another success status code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses['202'] =
        testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'An operation that returns a 202 status code should not return any other 2xx status codes'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.get.responses');
    });

    it('PUT operation does not define a recommended success code', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'];
      testDocument.paths['/v1/movies/{movie_id}'].put.responses['203'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'PUT operations should return a 200, 201, or 202 status code'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.put.responses'
      );
    });

    it('PATCH operation does not define a recommended success code', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/cars/{car_id}'].patch.responses['200'];
      testDocument.paths['/v1/cars/{car_id}'].patch.responses['203'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'PATCH operations should return a 200 or 202 status code'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.responses'
      );
    });

    it('301, 302, 305, 305 status codes should have response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['305'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'A 301, 302, 305 or 307 response should include a response body, use a different status code for responses without content'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.responses');
    });
  });
});
