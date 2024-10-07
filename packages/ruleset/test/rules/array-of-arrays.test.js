/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { arrayOfArrays } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = arrayOfArrays;
const ruleId = 'ibm-no-array-of-arrays';
const expectedSeverity = severityCodes.warning;
const expectedMessage = 'Array schemas should avoid having items of type array';

// Create a few array schemas for test data.
const arrayOfString = {
  type: 'array',
  items: {
    type: 'string',
  },
};

const arrayOfInt = {
  type: 'array',
  items: {
    type: 'integer',
  },
};

const arrayOfArrayOfString = {
  type: 'array',
  items: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
};

const arrayOfArrayOfInt = {
  type: 'array',
  items: {
    type: 'array',
    items: {
      type: 'integer',
    },
  },
};

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of strings referenced from schema property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfString;
      testDocument.components.schemas['Movie'].properties['array_prop'] = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of strings used in schema property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfString;
      testDocument.components.schemas['Movie'].properties['array_prop'] =
        arrayOfString;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of ints referenced from oneOf element', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfInt;
      testDocument.components.schemas['Juice'].properties['array_prop'] = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of ints used in inline requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfString;
      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = arrayOfInt;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Array of array of strings used in not for schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink.not = arrayOfArrayOfString;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Array of array of strings used in inline requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = arrayOfArrayOfString;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Array of array of strings referenced from schema property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfArrayOfString;
      testDocument.components.schemas['Movie'].properties['array_prop'] = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.array_prop',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.array_prop',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.array_prop',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.array_prop',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Array of array of ints referenced from path-level parameter', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = arrayOfArrayOfInt;
      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'array_param',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/Foo',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.parameters.0.schema'
      );
    });

    it('Array of array of ints used within operation-level referenced parameter', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters['ArrayParam'] = {
        name: 'array_param',
        description: 'the array parameter',
        in: 'header',
        schema: arrayOfArrayOfInt,
      };
      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          $ref: '#/components/parameters/ArrayParam',
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.parameters.0.schema'
      );
    });

    it('Array.items ref to array of strings', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['ArrayOfString'] = arrayOfString;
      testDocument.components.parameters['ArrayParam'] = {
        name: 'array_param',
        in: 'header',
        schema: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/ArrayOfString',
          },
        },
      };
      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          $ref: '#/components/parameters/ArrayParam',
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMessage);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.parameters.0.schema'
      );
    });
  });
});
