/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { paginationStyle } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
  helperArtifacts,
} = require('../test-utils');

// These are pre-defined objects with correct style for offset/limit pagination
// to use as a baseline. They aren't used in the root document because overall,
// we prefer token-based pagination and validate for that elsewhere.
const { offsetPaginationBase, offsetParameter } = helperArtifacts;

const rule = paginationStyle;
const ruleId = 'ibm-pagination-style';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Valid pagination with no "previous" or "last" properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Delete the "previous" and "last" properties from our two pagination base schemas.
      delete testDocument.components.schemas.DrinkCollection.allOf[0].properties
        .previous;
      delete testDocument.components.schemas.DrinkCollection.allOf[0].properties
        .last;
      delete testDocument.components.schemas.TokenPaginationBase.properties
        .previous;
      delete testDocument.components.schemas.TokenPaginationBase.properties
        .last;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on non-get operation', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Create new path with a non-get operation with an "invalid" limit param.
      // This should not be an error as it's not a get operation.
      const newPost = makeCopy(testDocument.paths['/v1/drinks'].post);
      newPost.parameters = [
        {
          name: 'limit',
          in: 'query',
          description: 'An invalid limit param',
          required: true,
          schema: {
            type: 'boolean',
          },
        },
      ];
      testDocument.paths['/v1/drinks/limitcheck'] = {
        post: newPost,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination within excluded path', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make a copy of a valid get operation, then make it invalid.
      const invalidGet = makeCopy(testDocument.paths['/v1/drinks'].get);
      invalidGet.parameters[0].required = true;

      // Next, add this invalid get operation to a new path that will be excluded.
      testDocument.paths['/v1/drinks/invalid/{path_param}'] = {
        get: invalidGet,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/no success response code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Next remove the success response code so operation will not be checked.
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/no success response content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Next remove the response-200 content so operation will not be checked.
      delete testDocument.paths['/v1/drinks'].get.responses['200'].content;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/no success response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Next remove the response schema so operation will not be checked.
      delete testDocument.paths['/v1/drinks'].get.responses['200'].content[
        'application/json'
      ].schema;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/non-json response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Add text/plain response content and remove the existing json response content.
      testDocument.paths['/v1/drinks'].get.responses['200'].content[
        'text/plain'
      ] = {
        schema: {
          type: 'string',
        },
      };
      delete testDocument.paths['/v1/drinks'].get.responses['200'].content[
        'application/json'
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/no response properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Next remove properties from response schema by turning it into a map schema.
      testDocument.paths['/v1/drinks'].get.responses['200'].content[
        'application/json'
      ].schema = {
        type: 'object',
        additionalProperties: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get w/no response array property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Make the get operation invalid by marking offset param as required.
      testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

      // Next remove properties from response schema by turning it into a map schema.
      testDocument.paths['/v1/drinks'].get.responses['200'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          not_an_array: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Invalid pagination on get operation w/ no offset or start param', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Create an "invalid" limit parameter, but this operation should not be
      // flagged since it doesn't define an "offset" or "start" param.
      const get = testDocument.paths['/v1/drinks'].get;
      get.parameters = [
        {
          name: 'limit',
          in: 'query',
          description: 'An invalid limit param',
          required: true,
          schema: {
            type: 'boolean',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it.each(['3.0.0', '3.1.0'])(
      'Valid pagination on get operation w/ no limit param or response property',
      async function (oasVersion) {
        const testDocument = makeCopy(rootDocument);
        testDocument.openapi = oasVersion;

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);

        // Remove the limit param and limit response property from the "list_movies" operation.
        testDocument.paths['/v1/movies'].get.parameters.splice(2, 1);
        delete testDocument.components.schemas['TokenPaginationBase'].properties
          .limit;
        testDocument.components.schemas['TokenPaginationBase'].required.splice(
          0,
          1
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(0);
      }
    );
    it('Response indicates pagination, but operation has no parameters', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      // Remove the operation's entire parameters field.
      delete testDocument.paths['/v1/drinks'].get.parameters;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });
  describe('Should yield errors', () => {
    // Within this section, the nested 'describe' blocks will indicate which check
    // they are validating.  For example, "Check #1" refers to the section of code
    // within the rule function that is marked with the "Check #1" comment.

    describe('Check #1 - limit param should be integer, optional with maximum and default values', () => {
      it('"limit" param not an integer', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.paths['/v1/drinks'].get.parameters[1].schema = {
          type: 'boolean',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.1');
      });
      it('"limit" param not optional', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.paths['/v1/drinks'].get.parameters[1].required = true;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.1');
      });
      it('"limit" param w/no default', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        delete testDocument.paths['/v1/drinks'].get.parameters[1].schema
          .default;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.1');
      });
      it('"limit" param w/no maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        delete testDocument.paths['/v1/drinks'].get.parameters[1].schema
          .maximum;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.1');
      });
    });
    describe('Check #2 - offset param should be integer and optional', () => {
      it('"offset" param not an integer', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.paths['/v1/drinks'].get.parameters[0].schema = {
          type: 'string',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgOffsetParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.0');
      });
      it('"offset" param not optional', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.paths['/v1/drinks'].get.parameters[0].required = true;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgOffsetParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get.parameters.0');
      });
    });
    describe('Check #3 - if offset param defined, then limit param should be defined', () => {
      it('"limit" param missing', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        // Remove the "limit" query param.
        testDocument.paths['/v1/drinks'].get.parameters.splice(1, 1);

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitParamMissing);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.get');
      });
    });
    describe('Check #4 - start param should be string and optional', () => {
      it('"start" param not a string', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.paths['/v1/movies'].get.parameters[1].schema = {
          type: 'integer',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgStartParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/movies.get.parameters.1');
      });
      it('"start" param not optional', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.paths['/v1/movies'].get.parameters[1].required = true;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgStartParam);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/movies.get.parameters.1');
      });
      it('page token param not named "start"', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.paths['/v1/movies'].get.parameters[1].name = 'page_token';

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgStartParamName);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/movies.get.parameters.1');
      });
    });
    describe('Check #5 - limit response property should be integer and required', () => {
      it('"limit" response property missing', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.limit;
        testDocument.components.schemas.DrinkCollection.allOf[0].required.splice(
          1,
          1
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
      it('"limit" response property not an integer', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.components.schemas.DrinkCollection.allOf[0].properties.limit =
          {
            type: 'string',
          };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitRespProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
      it('"limit" response property not required', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        // Remove "limit" from required list.
        testDocument.components.schemas.DrinkCollection.allOf[0].required = [
          'offset',
          'total_count',
        ];

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgLimitRespProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
    });
    describe('Check #6 - offset response property should be integer and required', () => {
      it('"offset" response property missing', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.offset;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgOffsetProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
      it('"offset" response property not an integer', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.components.schemas.DrinkCollection.allOf[0].properties.offset =
          {
            type: 'boolean',
          };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgOffsetRespProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
      it('"offset" response property not required', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        // Remove "offset" from required list.
        testDocument.components.schemas.DrinkCollection.allOf[0].required = [
          'limit',
          'total_count',
        ];

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgOffsetRespProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
    });
    describe('Check #8 - total_count response property should be integer and required', () => {
      it('"total_count" response property not an integer', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        testDocument.components.schemas.DrinkCollection.allOf[0].properties.total_count =
          {
            type: 'boolean',
          };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgTotalCountProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
      it('"total_count" response property not required', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        // Remove "total_count" from required list.
        testDocument.components.schemas.DrinkCollection.allOf[0].required = [
          'limit',
          'offset',
        ];

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        const r = results[0];
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgTotalCountProp);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe(
          'paths./v1/drinks.get.responses.200.content.application/json.schema'
        );
      });
    });
    describe('Checks #9-12 - response schema must define correct pagelink properties', () => {
      it('pagelink properties missing', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.first;
        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.last;
        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.previous;
        delete testDocument.components.schemas.DrinkCollection.allOf[0]
          .properties.next;

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(2);
        for (const r of results) {
          expect(r.code).toBe(ruleId);
          expect(r.message).toMatch(expectedMsgPagelinkRE);
          expect(r.severity).toBe(expectedSeverity);
          expect(r.path.join('.')).toBe(
            'paths./v1/drinks.get.responses.200.content.application/json.schema'
          );
        }
      });
      it('pagelink properties not an object', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        const paginationProps =
          testDocument.components.schemas.DrinkCollection.allOf[0].properties;

        // Define new pagelink properties as strings.
        const stringSchema = {
          type: 'string',
        };
        const newPageLinks = {
          first: stringSchema,
          last: stringSchema,
          previous: stringSchema,
          next: stringSchema,
        };

        // Overlay the new pagelink properties onto the schema.
        testDocument.components.schemas.DrinkCollection.allOf[0].properties = {
          ...paginationProps,
          ...newPageLinks,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(4);
        for (const r of results) {
          expect(r.code).toBe(ruleId);
          expect(r.message).toMatch(expectedMsgPagelinkObjectRE);
          expect(r.severity).toBe(expectedSeverity);
          expect(r.path.join('.')).toBe(
            'paths./v1/drinks.get.responses.200.content.application/json.schema'
          );
        }
      });
      it('pagelink properties object w/no properties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        const paginationProps =
          testDocument.components.schemas.DrinkCollection.allOf[0].properties;

        // Define pagelink properties as objects with no properties.
        const pageLinkSchema = {
          type: 'object',
        };
        const newPageLinks = {
          first: pageLinkSchema,
          last: pageLinkSchema,
          previous: pageLinkSchema,
          next: pageLinkSchema,
        };

        // Overlay the new pagelink properties onto the schema.
        testDocument.components.schemas.DrinkCollection.allOf[0].properties = {
          ...paginationProps,
          ...newPageLinks,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(4);
        for (const r of results) {
          expect(r.code).toBe(ruleId);
          expect(r.message).toMatch(expectedMsgPagelinkObjectRE);
          expect(r.severity).toBe(expectedSeverity);
          expect(r.path.join('.')).toBe(
            'paths./v1/drinks.get.responses.200.content.application/json.schema'
          );
        }
      });
      it('pagelink properties object w/no "href" property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        const paginationProps =
          testDocument.components.schemas.DrinkCollection.allOf[0].properties;

        // Define pagelink properties as objects no "href" property.
        const pageLinkSchema = {
          type: 'object',
          properties: {
            not_href: {
              type: 'string',
            },
          },
        };
        const newPageLinks = {
          first: pageLinkSchema,
          last: pageLinkSchema,
          previous: pageLinkSchema,
          next: pageLinkSchema,
        };

        // Overlay the new pagelink properties onto the schema.
        testDocument.components.schemas.DrinkCollection.allOf[0].properties = {
          ...paginationProps,
          ...newPageLinks,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(4);
        for (const r of results) {
          expect(r.code).toBe(ruleId);
          expect(r.message).toMatch(expectedMsgPagelinkObjectRE);
          expect(r.severity).toBe(expectedSeverity);
          expect(r.path.join('.')).toBe(
            'paths./v1/drinks.get.responses.200.content.application/json.schema'
          );
        }
      });
      it('pagelink properties object w/non-string "href" property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.DrinkCollection.allOf[0] =
          makeCopy(offsetPaginationBase);
        testDocument.paths['/v1/drinks'].get.parameters[0] =
          makeCopy(offsetParameter);

        const paginationProps =
          testDocument.components.schemas.DrinkCollection.allOf[0].properties;

        // Define pagelink properties as objects no "href" property.
        const pageLinkSchema = {
          type: 'object',
          properties: {
            not_href: {
              type: 'boolean',
            },
          },
        };
        const newPageLinks = {
          first: pageLinkSchema,
          last: pageLinkSchema,
          previous: pageLinkSchema,
          next: pageLinkSchema,
        };

        // Overlay the new pagelink properties onto the schema.
        testDocument.components.schemas.DrinkCollection.allOf[0].properties = {
          ...paginationProps,
          ...newPageLinks,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(4);
        for (const r of results) {
          expect(r.code).toBe(ruleId);
          expect(r.message).toMatch(expectedMsgPagelinkObjectRE);
          expect(r.severity).toBe(expectedSeverity);
          expect(r.path.join('.')).toBe(
            'paths./v1/drinks.get.responses.200.content.application/json.schema'
          );
        }
      });
    });
  });
});

// Expected error messages used by the tests above.
const expectedMsgLimitParam = `The 'limit' parameter must be of type integer and optional with default and maximum values`;
const expectedMsgLimitParamMissing = `The operation must define a 'limit' query parameter if the 'offset' query parameter is defined`;
const expectedMsgLimitProp = `A paginated list operation with a 'limit' query parameter must include a 'limit' property in the response body schema`;
const expectedMsgLimitRespProp = `The 'limit' property in the response body of a paginated list operation must be of type integer and required`;
const expectedMsgOffsetParam = `The 'offset' parameter must be of type integer and optional`;
const expectedMsgOffsetProp = `A paginated list operation with an 'offset' query parameter must include an 'offset' property in the response body schema`;
const expectedMsgOffsetRespProp = `The 'offset' property in the response body of a paginated list operation must be of type integer and required`;
const expectedMsgStartParam = `The 'start' parameter must be of type string and optional`;
const expectedMsgStartParamName = `The 'page_token' parameter should be named 'start'`;
const expectedMsgTotalCountProp = `The 'total_count' property in the response body of a paginated list operation must be of type integer and required`;
const expectedMsgPagelinkRE =
  /A paginated list operation should include a '.*' property in the response body schema/;
const expectedMsgPagelinkObjectRE =
  /The '.*' property should be an object with an 'href' string property/;
