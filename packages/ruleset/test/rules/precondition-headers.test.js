/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { preconditionHeader } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = preconditionHeader;
const ruleId = 'ibm-precondition-headers';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('412 response code with conditional header parameter defined', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies/{movie_id}'].put.responses['412'] =
        testDocument.paths['/v1/movies/{movie_id}'].put.responses['400'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('412 response code without conditional header parameter defined', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies/{movie_id}'].get.responses['412'] =
        testDocument.paths['/v1/movies/{movie_id}'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'An operation that returns a 412 status code must support at least one conditional header'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.get.responses'
      );
    });
  });
});
