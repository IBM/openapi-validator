/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { avoidMultipleTypes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = avoidMultipleTypes;
const ruleId = 'ibm-avoid-multiple-types';
const expectedSeverity = severityCodes.error;
const expectedMessage = `Avoid multiple types in schema 'type' field`;

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('One-element type list - property', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['NormalString'].type = ['string'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('One-element type list - parameter', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: ['string'],
            minLength: 1,
            maxLength: 15,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Two-element type list includes "null" - property', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['NormalString'].type = ['null', 'string'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Two-element type list includes "null" - parameter', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter1',
          in: 'query',
          schema: {
            type: ['string', 'null'],
            minLength: 1,
            maxLength: 15,
          },
        },
        {
          name: 'filter2',
          in: 'query',
          schema: {
            type: ['null', 'string'],
            minLength: 1,
            maxLength: 15,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Multiple values in type list - property', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['UrlString'].type = [
        'integer',
        'string',
        'null',
        'boolean',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(6);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.imdb_url.type',
        'paths./v1/movies.post.requestBody.content.application/json.schema.properties.imdb_url.type',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.imdb_url.type',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.imdb_url.type',
        'paths./v1/movies/{movie_id}.put.requestBody.content.application/json.schema.properties.imdb_url.type',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.imdb_url.type',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Multiple values in type list - parameter', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: ['integer', 'string', 'null', 'boolean'],
            minLength: 1,
            maxLength: 15,
          },
        },
      ];
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.message).toBe(expectedMessage);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.path.join('.')).toBe(
        'paths./v1/movies.post.parameters.0.schema.type'
      );
    });
  });
});
