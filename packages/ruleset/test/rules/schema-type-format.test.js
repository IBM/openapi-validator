/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaTypeFormat } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaTypeFormat;
const ruleId = 'ibm-schema-type-format';
const expectedSeverity = severityCodes.error;

const errorMsgInvalidType = /^Invalid type; valid types are:.*$/;
const errorMsgStringFormat =
  /^Schema of type string should use one of the following formats:.*$/;
const errorMsgIntegerFormat =
  /^Schema of type integer should use one of the following formats:.*$/;
const errorMsgNumberFormat =
  /^Schema of type number should use one of the following formats:.*$/;
const errorMsgNoFormat = /^Schema of type .* should not have a format*$/;
const errorMsgFormatButNoType = /^Format defined without a type$/;
const errorMsgFormatWithMultipleTypes =
  /^Format defined with multiple types is ambiguous$/;

// Define a few collections of properties used to build test schemas.
const validPropertiesNoFormat = {
  array_prop: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  bool_prop: {
    type: ['null', 'boolean'],
  },
  int_prop: {
    type: 'integer',
  },
  number_prop: {
    type: 'number',
  },
  object_prop: {
    type: 'object',
    properties: {
      prop1: {
        type: ['string', 'null'],
      },
    },
  },
  string_prop: {
    type: 'string',
  },
};

const validStringProperties = {
  binary_prop: {
    type: 'string',
    format: 'binary',
  },
  byte_prop: {
    type: 'string',
    format: 'byte',
  },
  crn_prop: {
    type: 'string',
    format: 'crn',
  },
  date_prop: {
    type: ['string'],
    format: 'date',
  },
  datetime_prop: {
    type: 'string',
    format: 'date-time',
  },
  email_prop: {
    type: ['string', 'null'],
    format: 'email',
  },
  id_prop: {
    type: 'string',
    format: 'identifier',
  },
  pw: {
    type: 'string',
    format: 'password',
  },
  url_prop: {
    type: ['string'],
    format: 'url',
  },
  uuid_prop: {
    type: 'string',
    format: 'uuid',
  },
};

const validIntegerProperties = {
  int_prop: {
    type: 'integer',
    format: 'int32',
  },
  long_prop: {
    type: ['integer', 'null'],
    format: 'int64',
  },
};

const validNumberProperties = {
  float_prop: {
    type: 'number',
    format: 'float',
  },
  double_prop: {
    type: ['null', 'number'],
    format: 'double',
  },
};

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid types with no format - referenced schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'object',
        properties: validPropertiesNoFormat,
      };
      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid types with no format - inline requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: validPropertiesNoFormat,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid string properties with format - inline response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: validStringProperties,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid integer properties with format - referenced response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'object',
        properties: validIntegerProperties,
      };
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid number properties with format - referenced schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'object',
        properties: validNumberProperties,
      };
      testDocument.components.schemas['Movie'].properties['foo_prop'] = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Array.items with valid number/format', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'array',
        items: {
          type: 'number',
          format: 'double',
        },
      };
      testDocument.components.schemas['Movie'].properties['foo_prop'] = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Schema with invalid type - inline requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'invalid_type',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgInvalidType);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Schema property with invalid type - inline response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          invalid_prop: {
            type: ['invalid_type'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgInvalidType);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.invalid_prop'
      );
    });

    it('Array.items with invalid type - referenced requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'array',
        items: {
          type: 'invalid_type',
        },
      };
      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgInvalidType);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.items'
      );
    });

    it('Object schema with format - inline requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: ['object'],
        format: 'notanobject',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgNoFormat);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Array schema with format - referenced requestBody schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'array',
        format: 'notanarray',
        items: {
          type: 'string',
        },
      };
      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgNoFormat);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Boolean schema with format - referenced response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        type: 'boolean',
        format: 'notaboolean',
      };
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgNoFormat);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema'
      );
    });

    it('Schema with format but no type - referenced response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Foo'] = {
        format: 'date',
      };
      testDocument.components.responses.FooResponse = {
        schema: {
          $ref: '#/components/schemas/Foo',
        },
      };
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ] = {
        $ref: '#/components/responses/FooResponse',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgFormatButNoType);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema'
      );
    });

    it('String schema with invalid format - referenced requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.FooRequestBody = {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              format: 'notastring',
            },
          },
        },
      };
      testDocument.paths['/v1/drinks'].post.requestBody = {
        $ref: '#/components/requestBodies/FooRequestBody',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgStringFormat);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Integer schema with invalid format - referenced schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['BadIntProp'] = {
        type: ['integer'],
        format: 'notaninteger',
      };

      testDocument.components.schemas['Movie'].properties['bad_int_prop'] = {
        $ref: '#/components/schemas/BadIntProp',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.bad_int_prop',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.bad_int_prop',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.bad_int_prop',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.bad_int_prop',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(errorMsgIntegerFormat);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Number schema with invalid format - inline response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          bad_number_prop: {
            type: 'number',
            format: 'notanumber',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgNumberFormat);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.bad_number_prop'
      );
    });
    it('Multiple types with format - inline response schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          bad_number_prop: {
            type: ['number', 'null', 'string'],
            format: 'float',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toMatch(errorMsgFormatWithMultipleTypes);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.bad_number_prop'
      );
    });
  });
});
