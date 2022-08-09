const { descriptionMentionsJSON } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = descriptionMentionsJSON;
const ruleId = 'description-mentions-json';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Schema descriptions should avoid mentioning "JSON"';

describe('Spectral rule: description-mentions-json', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Inline request body schema description mentions JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            type: 'string',
            description: 'Not a JSON object.'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'requestBody',
        'content',
        'text/html',
        'schema'
      ]);
    });

    it('Named schema description mentions JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].description =
        'This is a JSON object.';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema'
      ]);
      expect(results[1].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema'
      ]);
      expect(results[2].path).toStrictEqual([
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
        'drinks',
        'items'
      ]);
      expect(results[3].path).toStrictEqual([
        'paths',
        '/v1/drinks/{drink_id}',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema'
      ]);
    });

    it('Inline response schema description mentions JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        description: 'A JSON object containing the error details.',
        type: 'object',
        properties: {
          trace: {
            description: 'The error trace information.',
            type: 'string',
            format: 'uuid'
          },
          error: {
            $ref: '#/components/schemas/RequestError'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '400',
        'content',
        'application/json',
        'schema'
      ]);
    });

    it('Re-used oneOf child schema description mentions JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      // Set description to trigger a rule violation.
      testDocument.components.schemas['Soda'].description =
        'A jSoN object that describes a soda.';

      // Add another (non-oneOf) reference to the Soda schema.
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Soda'
      };

      // We should get back a warning ONLY due to the Soda reference in the response (not the oneOf).
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'oneOf',
        '1'
      ]);
      expect(results[1].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema'
      ]);
      expect(results[2].path).toStrictEqual([
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
        'drinks',
        'items',
        'oneOf',
        '1'
      ]);
      expect(results[3].path).toStrictEqual([
        'paths',
        '/v1/drinks/{drink_id}',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'oneOf',
        '1'
      ]);
    });

    it('Re-used string schema description mentions JSON', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['IdString'].description =
        'This is NOT a JSON object!';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(5);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
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
        'properties',
        'id'
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
        'properties',
        'id'
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
        'properties',
        'id'
      ]);
      expect(results[3].path).toStrictEqual([
        'paths',
        '/v1/movies/{movie_id}',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'id'
      ]);
      expect(results[4].path).toStrictEqual([
        'paths',
        '/v1/movies/{movie_id}',
        'put',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'id'
      ]);
    });

    it('Property named like x-* has description that mentions JSON', async () => {
      // This testcase is added here because the old rule (incorrectly) filtered
      // out properties named like "x-*", purportedly to avoid giving warnings
      // for extensions.  Well, a schema property named "x-*" is technically
      // NOT an extension, so the rule should in fact process properties
      // named like "x-*" just like any other properties.

      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Movie'].properties[
        'x-not-an-extension'
      ] = {
        type: 'string',
        description: 'This is not a JsOn object!'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(5);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
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
        'properties',
        'x-not-an-extension'
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
        'properties',
        'x-not-an-extension'
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
        'properties',
        'x-not-an-extension'
      ]);
      expect(results[3].path).toStrictEqual([
        'paths',
        '/v1/movies/{movie_id}',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'x-not-an-extension'
      ]);
      expect(results[4].path).toStrictEqual([
        'paths',
        '/v1/movies/{movie_id}',
        'put',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'x-not-an-extension'
      ]);
    });
  });
});
