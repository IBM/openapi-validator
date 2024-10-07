/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { etagHeaderExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = etagHeaderExists;
const ruleId = 'ibm-etag-header';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('No need for ETag', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove the If-Match header param and the ETag response header.
      delete testDocument.paths['/v1/movies/{movie_id}'].put.parameters;
      delete testDocument.components.responses.MovieWithETag.headers;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('No GET operation', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].get;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.message).toBe(
        `'ETag' response header is required, but no GET operation is defined`
      );
      expect(result.path.join('.')).toBe('paths./v1/movies/{movie_id}');
    });

    it('No responses', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].get.responses;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.message).toBe(
        `'ETag' response header is required, but GET operation defines no success responses`
      );
      expect(result.path.join('.')).toBe('paths./v1/movies/{movie_id}.get');
    });

    it('No success responses', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies/{movie_id}'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.message).toBe(
        `'ETag' response header is required, but GET operation defines no success responses`
      );
      expect(result.path.join('.')).toBe('paths./v1/movies/{movie_id}.get');
    });

    it('No response headers', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.responses.MovieWithETag.headers;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.message).toBe(`'ETag' response header is required`);
      expect(result.path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.get.responses.200'
      );
    });

    it('No ETag response header', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.responses.MovieWithETag.headers['NOT-ETAG'] =
        testDocument.components.responses.MovieWithETag.headers['ETag'];
      delete testDocument.components.responses.MovieWithETag.headers['ETag'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.message).toBe(`'ETag' response header is required`);
      expect(result.path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.get.responses.200.headers'
      );
    });
  });
});
