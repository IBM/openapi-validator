/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { collectionArrayProperty } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');
const { LoggerFactory } = require('../../src/utils');

const rule = collectionArrayProperty;
const ruleId = 'ibm-collection-array-property';
const expectedSeverity = severityCodes.warning;
const expectedMsg = `Collection list operation response schema should define array property with name: movies`;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('would normally warn but path contains quote character, which throws off spectral', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths["/v1/movies'"] = testDocument.paths['/v1/movies'];
      delete testDocument.paths['/v1/movies'];

      testDocument.components.schemas[
        'MovieCollection'
      ].allOf[1].properties.movies = {
        type: 'string',
      };

      const logger = LoggerFactory.getInstance().getLogger(ruleId);
      const debugSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

      const results = await testRule(ruleId, rule, testDocument);

      expect(results).toHaveLength(0);
      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(debugSpy.mock.calls[0][0]).toMatch('could not find path object');
      debugSpy.mockRestore();
    });
  });
  describe('Should yield errors', () => {
    it('array property with incorrect name', async () => {
      const testDocument = makeCopy(rootDocument);

      // Effectively rename the "movies" property to be "at_the_movies".
      const arrayProp =
        testDocument.components.schemas['MovieCollection'].allOf[1].properties
          .movies;
      testDocument.components.schemas['MovieCollection'].allOf[1].properties[
        'at_the_movies'
      ] = arrayProp;
      delete testDocument.components.schemas['MovieCollection'].allOf[1]
        .properties.movies;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/movies.get.responses.200.content.application/json.schema'
      );
    });
    it('correctly named property not an array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas[
        'MovieCollection'
      ].allOf[1].properties.movies = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe(
        'paths./v1/movies.get.responses.200.content.application/json.schema'
      );
    });
  });
});
