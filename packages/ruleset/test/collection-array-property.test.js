/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { collectionArrayProperty } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

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
