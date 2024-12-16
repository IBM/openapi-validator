/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isParamContentSchema,
  isParamSchema,
  isPrimarySchema,
  isRequestBodySchema,
  isResponseSchema,
  isSchemaProperty,
} = require('../../src/utils');

describe('Path Location utility functions', () => {
  describe('isParamContentSchema()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isParamContentSchema(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isParamContentSchema('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isParamContentSchema({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamContentSchema(path)).toBe(true);
    });

    it('should return `true` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamContentSchema(path)).toBe(true);
    });

    it('should return `false` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isParamContentSchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isParamContentSchema(path)).toBe(false);
    });

    it('should return `false` for request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamContentSchema(path)).toBe(false);
    });

    it('should return `false` for response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamContentSchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
        'properties',
        'schema',
      ];
      expect(isParamContentSchema(path)).toBe(false);
    });
  });

  describe('isParamSchema()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isParamSchema(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isParamSchema('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isParamSchema({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isParamSchema(path)).toBe(true);
    });

    it('should return `true` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isParamSchema(path)).toBe(true);
    });

    it('should return `false` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamSchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamSchema(path)).toBe(false);
    });

    it('should return `false` for request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamSchema(path)).toBe(false);
    });

    it('should return `false` for response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isParamSchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'schema',
        'properties',
        'parameters',
        'properties',
        'schema',
      ];
      expect(isParamSchema(path)).toBe(false);
    });
  });

  describe('isPrimarySchema()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isPrimarySchema(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isPrimarySchema('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isPrimarySchema({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for top level request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(true);
    });

    it('should return `true` for top level response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(true);
    });

    it('should return `true` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(true);
    });

    it('should return `true` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(true);
    });

    it('should return `false` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isPrimarySchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isPrimarySchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema in a schema named content', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'content',
        'properties',
        'schema',
      ];
      expect(isPrimarySchema(path)).toBe(false);
    });
  });

  describe('isRequestBodySchema()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isRequestBodySchema(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isRequestBodySchema('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isRequestBodySchema({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for top level request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isRequestBodySchema(path)).toBe(true);
    });

    it('should return `false` for top level response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isRequestBodySchema(path)).toBe(false);
    });

    it('should return `false` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isRequestBodySchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isRequestBodySchema(path)).toBe(false);
    });

    it('should return `false` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isRequestBodySchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isRequestBodySchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'requestBody',
        'properties',
        'content',
        'properties',
        'schema',
      ];
      expect(isRequestBodySchema(path)).toBe(false);
    });
  });

  describe('isResponseSchema()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isResponseSchema(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isResponseSchema('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isResponseSchema({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for top level response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isResponseSchema(path)).toBe(true);
    });

    it('should return `false` for top level request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isResponseSchema(path)).toBe(false);
    });

    it('should return `false` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isResponseSchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isResponseSchema(path)).toBe(false);
    });

    it('should return `false` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isResponseSchema(path)).toBe(false);
    });

    it('should return `false` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isResponseSchema(path)).toBe(false);
    });

    it('should return `false` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'responses',
        'properties',
        'content',
        'properties',
        'schema',
      ];
      expect(isResponseSchema(path)).toBe(false);
    });
  });

  describe('isSchemaProperty()', () => {
    it('should throw for non-array path', () => {
      const expectedMessage = 'argument "path" must be an array!';

      expect(() => {
        isSchemaProperty(undefined);
      }).toThrowError(expectedMessage);
      expect(() => {
        isSchemaProperty('string');
      }).toThrowError(expectedMessage);
      expect(() => {
        isSchemaProperty({});
      }).toThrowError(expectedMessage);
    });

    it('should return `true` for a schema property', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'something',
      ];
      expect(isSchemaProperty(path)).toBe(true);
    });

    it('should return `true` for schema property named schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'schema',
      ];
      expect(isSchemaProperty(path)).toBe(true);
    });

    it('should return `true` for schema property of property named properties', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'properties',
      ];
      expect(isSchemaProperty(path)).toBe(true);
    });

    it('should return `false` for top level response body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
      ];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for top level request body schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'requestBody',
        'content',
        'application/json',
        'schema',
      ];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for path parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'parameters',
        '2',
        'content',
        'application/json',
        'schema',
      ];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for operation parameter content schema', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'parameters',
        '1',
        'content',
        'application/json',
        'schema',
      ];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for path parameter schema', () => {
      const path = ['paths', '/resources', 'parameters', '2', 'schema'];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for operation parameter schema', () => {
      const path = ['paths', '/resources', 'get', 'parameters', '1', 'schema'];
      expect(isSchemaProperty(path)).toBe(false);
    });

    it('should return `false` for properties field of schema property named properties', () => {
      const path = [
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'properties',
        'properties',
      ];
      expect(isSchemaProperty(path)).toBe(false);
    });
  });
});
