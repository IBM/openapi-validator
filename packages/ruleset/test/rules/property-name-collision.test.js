/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { propertyNameCollision } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-avoid-property-name-collision';
const rule = propertyNameCollision;

const expectedMessage =
  'Avoid duplicate property names within a schema, even if different case conventions are used';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if invalid properties are deprecated', async () => {
    const testDocument = makeCopy(rootDocument);

    testDocument.components.schemas.Movie.properties.IMDBRating = {
      type: 'string',
      deprecated: true,
    };
    testDocument.components.schemas.Movie.properties.IDMB_rating = {
      type: 'string',
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should return an error when two property names of different case conventions are identical if converted to a single case', async () => {
    const testDocument = makeCopy(rootDocument);

    testDocument.components.schemas.Movie.properties.IMDBRating = {
      type: 'string',
    };
    testDocument.components.schemas.Movie.properties.IMDB_rating = {
      type: 'string',
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.IMDB_rating',
      'paths./v1/movies.post.responses.201.content.application/json.schema.properties.IMDB_rating',
      'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.IMDB_rating',
      'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.IMDB_rating',
    ];

    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toBe(expectedMessage);
      expect(results[i].severity).toBe(expectedSeverity);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });
});
