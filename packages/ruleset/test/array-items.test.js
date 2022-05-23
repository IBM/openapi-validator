const { arrayItems } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = arrayItems;
const ruleId = 'array-items';
const expectedSeverity = severityCodes.error;
const expectedMessage = 'Array schemas must specify "items" property';

describe('Spectral rule: array-items', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('allOf element without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.DrinkCollection.allOf[1].properties
        .drinks.items;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'allOf',
        '1',
        'properties',
        'drinks'
      ]);
    });
    it('Response schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieCollection = {
        type: 'array'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema'
      ]);
    });
    it('Request schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema'
      ]);
    });
    it('Request schema with non-object items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: 'not a schema!'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema'
      ]);
    });
    it('additionalProperties schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.additionalProperties = {
        type: 'array'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMessage);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'additionalProperties'
      ]);
      expect(results[1].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'additionalProperties'
      ]);
      expect(results[2].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'allOf',
        '1',
        'properties',
        'movies',
        'items',
        'additionalProperties'
      ]);
    });
  });
});
