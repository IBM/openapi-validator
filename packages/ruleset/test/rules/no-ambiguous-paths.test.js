/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');
const { noAmbiguousPaths } = require('../../src/rules');

const rule = noAmbiguousPaths;
const ruleId = 'ibm-no-ambiguous-paths';
const expectedSeverity = severityCodes.warning;
const expectedMsgRE = /^Paths are ambiguous:/;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('/foos/{foo_id} vs /foos/{id}/bar', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/foos/{foo_id}'] = {};
      testDocument.paths['/foos/{id}/bar'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });
  describe('Should yield errors', () => {
    it('/v1/drinks/{drink_id} vs /v1/drinks/foo', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/foo'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = ['paths./v1/drinks/{drink_id}'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(expectedMsgRE);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('/{version}/drinks vs /v1/drinks', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/{version}/drinks'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = ['paths./v1/drinks'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(expectedMsgRE);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('/{foo}/bar vs /foo/{bar}', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/{foo}/bar'] = {};
      testDocument.paths['/foo/{bar}'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = ['paths./{foo}/bar'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(expectedMsgRE);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('/v1/movies/{movie_id} vs /v1/movies/{film_id}', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies/{film_id}'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = ['paths./v1/movies/{movie_id}'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(expectedMsgRE);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
