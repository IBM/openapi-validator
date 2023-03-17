/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { parameterCasingConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = parameterCasingConvention;
const ruleId = 'ibm-parameter-casing-convention';
const expectedSeverity = severityCodes.error;

const expectedMsgNoName = 'Parameters must have a name';
const expectedMsgNoIn = "Parameters must have a valid 'in' value";
const expectedMsgQuery = 'Query parameter names must be snake case';
const expectedMsgPath = 'Path parameter names must be snake case';
const expectedMsgHeader = 'Header parameter names must be pascal case';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Query parameter with correct case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'movie_rating',
        required: false,
        in: 'query',
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Query parameter with "." in name', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'movie_rating.value',
        required: false,
        in: 'query',
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Path parameter with correct case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].parameters = [
        {
          description: 'An optional movie rating to filter on.',
          name: 'movie_rating',
          required: false,
          in: 'path',
          schema: {
            type: 'string',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Header parameter with correct case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'X-Movie-Rating',
        required: false,
        in: 'header',
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Deprecated query parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'movieRating',
        required: false,
        in: 'query',
        deprecated: true,
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Deprecated path parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'movieRating',
        required: false,
        in: 'path',
        deprecated: true,
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Deprecated header parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        name: 'movie_rating',
        required: false,
        in: 'header',
        deprecated: true,
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Parameter with no name', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.parameters.DrinkIdParam.name;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgNoName);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0'
      );
    });

    it('Parameter with no "in" value', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.parameters.DrinkIdParam.in;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgNoIn);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0'
      );
    });

    it('Query parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        required: false,
        name: 'moveRating',
        in: 'query',
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgQuery);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.3'
      );
    });

    it('Path parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.DrinkIdParam.name = 'drinkId';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgPath);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0'
      );
    });

    it('Path parameter with "." in name', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.DrinkIdParam.name = 'drinkId.value';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgPath);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0'
      );
    });

    it('Header parameter with incorrect case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters.push({
        description: 'An optional movie rating to filter on.',
        required: false,
        name: 'moveRating',
        in: 'header',
        schema: {
          type: 'string',
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgHeader);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.3'
      );
    });
  });
});
