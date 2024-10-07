/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { errorResponseSchemas } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = errorResponseSchemas;
const ruleId = 'ibm-error-response-schemas';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Error container model omits status_code property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorContainer.properties
        .status_code;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Error model omits target property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.Error.properties.target;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Error container model has no properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.responses['400'] = {
        content: {
          'application/json': {
            schema: {},
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error container model must be an object with properties`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/movies.get.responses.400.content.application/json.schema'
      );
    });

    it('No trace property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorContainer.properties.trace;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error container model should contain property 'trace' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties'
      );
    });

    it('trace property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorContainer.properties.trace = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error container model should contain property 'trace' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.trace'
      );
    });

    it('status_code property is not an integer', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorContainer.properties.status_code.type =
        'string';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(severityCodes.warning);
      expect(r.message).toBe(
        `Error container model property 'status_code' must be of type integer`
      );
      expect(r.path.join('.')).toStrictEqual(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.status_code'
      );
    });

    it('No errors property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorContainer.properties.errors;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error container model must contain property 'errors' which must be an array of error models`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties'
      );
    });

    it('errors property not an array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorContainer.properties.errors.type =
        'string';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(severityCodes.warning);
      expect(r.message).toBe(
        `Error container model must contain property 'errors' which must be an array of error models`
      );
      expect(r.path.join('.')).toStrictEqual(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors'
      );
    });

    it('errors array has no items', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorContainer.properties.errors
        .items;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(severityCodes.warning);
      expect(r.message).toBe(
        `Error container model 'errors.items' field must be an object with properties`
      );
      expect(r.path.join('.')).toStrictEqual(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors'
      );
    });

    it('errors array items not an object', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorContainer.properties.errors.items =
        {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(severityCodes.warning);
      expect(r.message).toBe(
        `Error container model 'errors.items' field must be an object with properties`
      );
      expect(r.path.join('.')).toStrictEqual(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items'
      );
    });

    it('No code property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.Error.properties.code;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model must contain property 'code' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties'
      );
    });

    it('code property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Error.properties.code = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model must contain property 'code' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.code'
      );
    });

    it('code property has no enum', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.Error.properties.code.enum;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model property 'code' must include an enumeration of the valid error codes`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.code'
      );
    });

    it('code property invalid enum', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Error.properties.code.enum = 'foo';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model property 'code' must include an enumeration of the valid error codes`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.code.enum'
      );
    });

    it('No message property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.Error.properties.message;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model must contain property 'message' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties'
      );
    });

    it('message property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Error.properties.message = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model must contain property 'message' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.message'
      );
    });

    it('No more_info property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.Error.properties.more_info;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model should contain property 'more_info' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties'
      );
    });

    it('more_info property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Error.properties.more_info = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model should contain property 'more_info' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.more_info'
      );
    });

    it('target property not an error target model', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Error.properties.target = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error model property 'target' must be a valid error target model object`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target'
      );
    });

    it('error target model has no type property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorTarget.properties.type;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model must contain property 'type' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties'
      );
    });

    it('error target model type property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorTarget.properties.type = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model must contain property 'type' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties.type'
      );
    });

    it('type property has no enum', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorTarget.properties.type.enum;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model property 'type' must define an enumeration containing ['field', 'header', 'parameter']`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties.type'
      );
    });

    it('type property has incorrect enum', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorTarget.properties.type.enum = [
        'property',
        'queryParam',
        'headerParam',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model property 'type' must define an enumeration containing ['field', 'header', 'parameter']`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties.type.enum'
      );
    });

    it('error target model has no name property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.ErrorTarget.properties.name;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model must contain property 'name' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties'
      );
    });

    it('error target model name property not a string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.ErrorTarget.properties.name = {
        type: 'integer',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(10);

      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        `Error target model must contain property 'name' of type string`
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/cars.post.responses.400.content.application/json.schema.properties.errors.items.properties.target.properties.name'
      );
    });
  });
});
