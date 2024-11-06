/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getSuccessResponseSchemaForOperation,
  getRequestBodySchemaForOperation,
  getCanonicalSchemaForPath,
} = require('../../src/utils');

describe('Schema finding utility functions', () => {
  describe('getSuccessResponseSchemaForOperation()', () => {
    const pathToOp = 'paths./v1/resources.get';

    it('should return an empty object if operation is undefined', () => {
      const operation = undefined;
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation has no responses', () => {
      const operation = {};
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation has no success responses', () => {
      const operation = {
        responses: {
          400: {},
        },
      };
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation success response has no content', () => {
      const operation = {
        responses: {
          200: {},
        },
      };
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation success response has no json content', () => {
      const operation = {
        responses: {
          200: {
            content: {
              'application/pdf': {},
            },
          },
        },
      };
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation success response content is not an object', () => {
      const operation = {
        responses: {
          200: {
            content: {
              'application/json': 42,
            },
          },
        },
      };
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should return an empty object if operation success response content has no schema', () => {
      const operation = {
        responses: {
          200: {
            content: {
              'application/json': {},
            },
          },
        },
      };
      expect(getSuccessResponseSchemaForOperation(operation, pathToOp)).toEqual(
        {}
      );
    });

    it('should prioritize 200 responses over other success responses', () => {
      const schema = {
        type: 'object',
      };
      const operation = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema,
              },
            },
          },
          202: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'for 202s',
                },
              },
            },
          },
        },
      };
      const { schemaObject, schemaPath } = getSuccessResponseSchemaForOperation(
        operation,
        pathToOp
      );
      expect(schemaObject).toEqual(schema);
      expect(schemaPath).toEqual(
        `${pathToOp}.responses.200.content.application/json.schema`
      );
    });

    it('should use a non-200 success response if there is no 200', () => {
      const schema = {
        type: 'object',
      };
      const operation = {
        responses: {
          202: {
            content: {
              'application/json; charset=utf-8': {
                schema,
              },
            },
          },
        },
      };
      const { schemaObject, schemaPath } = getSuccessResponseSchemaForOperation(
        operation,
        pathToOp
      );
      expect(schemaObject).toEqual(schema);
      expect(schemaPath).toEqual(
        `${pathToOp}.responses.202.content.application/json; charset=utf-8.schema`
      );
    });
  });

  describe('getRequestBodySchemaForOperation()', () => {
    const pathToPostOp = 'paths./v1/resources.post';
    const pathToPatchOp = 'paths./v1/resources.patch';

    it('should return empty object if operation is undefined', () => {
      const operation = undefined;
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation has no request body', () => {
      const operation = {};
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation request body has no content', () => {
      const operation = {
        requestBody: {},
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation request body content is not an object', () => {
      const operation = {
        requestBody: {
          content: 42,
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation request body content is not json', () => {
      const operation = {
        requestBody: {
          content: {
            'application/pdf': {},
          },
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation request body json content is not an object', () => {
      const operation = {
        requestBody: {
          content: {
            'application/json': 42,
          },
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if operation request body json content does not have a schema', () => {
      const operation = {
        requestBody: {
          content: {
            'application/json': {},
          },
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if non-patch operation uses json patch content', () => {
      const operation = {
        requestBody: {
          content: {
            'application/json-patch+json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if non-patch operation uses merge patch content', () => {
      const operation = {
        requestBody: {
          content: {
            'application/merge-patch+json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
      };
      expect(getRequestBodySchemaForOperation(operation, pathToPostOp)).toEqual(
        {}
      );
    });

    it('should return empty object if patch operation uses non-patch content', () => {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
      };
      expect(
        getRequestBodySchemaForOperation(operation, pathToPatchOp)
      ).toEqual({});
    });

    it('should return schema info for json content on non-patch operation', () => {
      const schema = {
        type: 'object',
      };
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema,
            },
          },
        },
      };
      const { schemaObject, schemaPath } = getRequestBodySchemaForOperation(
        operation,
        pathToPostOp
      );
      expect(schemaObject).toEqual(schema);
      expect(schemaPath).toEqual(
        `${pathToPostOp}.requestBody.content.application/json.schema`
      );
    });

    it('should return schema info for json patch content on patch operation', () => {
      const schema = {
        type: 'object',
      };
      const operation = {
        requestBody: {
          content: {
            'application/json-patch+json': {
              schema,
            },
          },
        },
      };
      const { schemaObject, schemaPath } = getRequestBodySchemaForOperation(
        operation,
        pathToPatchOp
      );
      expect(schemaObject).toEqual(schema);
      expect(schemaPath).toEqual(
        `${pathToPatchOp}.requestBody.content.application/json-patch+json.schema`
      );
    });

    it('should return schema info for merge patch content on patch operation', () => {
      const schema = {
        type: 'object',
      };
      const operation = {
        requestBody: {
          content: {
            'application/merge-patch+json': {
              schema,
            },
          },
        },
      };
      const { schemaObject, schemaPath } = getRequestBodySchemaForOperation(
        operation,
        pathToPatchOp
      );
      expect(schemaObject).toEqual(schema);
      expect(schemaPath).toEqual(
        `${pathToPatchOp}.requestBody.content.application/merge-patch+json.schema`
      );
    });
  });

  describe('getCanonicalSchemaForPath()', () => {
    const mockLogger = jest.fn();
    const logInfo = {
      logger: { debug: mockLogger },
      ruleId: 'test',
    };

    afterEach(() => {
      mockLogger.mockClear();
    });

    it('should return empty object if path is not defined', () => {
      const path = undefined;
      const apidef = getMockApiDef();
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if path is not a string', () => {
      const path = 42;
      const apidef = getMockApiDef();
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if apidef is not defined', () => {
      const path = '/v1/resources/{id}';
      const apidef = undefined;
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if apidef is not an object', () => {
      const path = '/v1/resources/{id}';
      const apidef = 'api';
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if apidef paths field is not an object', () => {
      const path = '/v1/resources/{id}';
      const apidef = { paths: 42 };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if apidef is not defined', () => {
      const path = '/v1/resources/{id}';
      const apidef = getMockApiDef();
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        undefined,
        logInfo
      );
      expect(result).toEqual({});
    });

    it('should return empty object if apidef is not an object', () => {
      const path = '/v1/resources/{id}';
      const apidef = getMockApiDef();
      const result = getCanonicalSchemaForPath(path, apidef, 42, logInfo);
      expect(result).toEqual({});
    });

    it('should return empty object if operation has no success response', () => {
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                400: {},
              },
            },
          },
        },
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      expect(result).toEqual({});
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be undefined'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be undefined'
      );
    });

    it('should return undefined schema and name if schema name is not found in the refs map', () => {
      const schema = {
        type: 'object',
      };
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema,
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Resource: schema,
          },
        },
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        { 'fake.path': 'FakeResource' },
        logInfo
      );
      const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
        result;

      expect(canonicalSchema).toEqual(undefined);
      expect(canonicalSchemaName).toBe(undefined);
      expect(canonicalSchemaPath).toBe(
        'paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be undefined'
      );
    });

    it('should return undefined schema if there are no components', () => {
      const schema = {
        type: 'object',
      };
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema,
                    },
                  },
                },
              },
            },
          },
        },
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
        result;

      expect(canonicalSchema).toEqual(undefined);
      expect(canonicalSchemaName).toBe('Resource');
      expect(canonicalSchemaPath).toBe(
        'paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be Resource'
      );
    });

    it('should return undefined schema if there are no schemas in components', () => {
      const schema = {
        type: 'object',
      };
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema,
                    },
                  },
                },
              },
            },
          },
        },
        components: {},
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
        result;

      expect(canonicalSchema).toEqual(undefined);
      expect(canonicalSchemaName).toBe('Resource');
      expect(canonicalSchemaPath).toBe(
        'paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be Resource'
      );
    });

    it('should return undefined schema if resource is not in schemas', () => {
      const schema = {
        type: 'object',
      };
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema,
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {},
        },
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
        result;

      expect(canonicalSchema).toEqual(undefined);
      expect(canonicalSchemaName).toBe('Resource');
      expect(canonicalSchemaPath).toBe(
        'paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be Resource'
      );
    });

    it('should find the canonical schema and log the process', () => {
      const schema = {
        type: 'object',
      };
      const path = '/v1/resources/{id}';
      const apidef = {
        paths: {
          '/v1/resources/{id}': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema,
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Resource: schema,
          },
        },
      };
      const result = getCanonicalSchemaForPath(
        path,
        apidef,
        getPathToRefsMap(),
        logInfo
      );
      const { canonicalSchema, canonicalSchemaName, canonicalSchemaPath } =
        result;

      expect(canonicalSchema).toEqual(schema);
      expect(canonicalSchemaName).toBe('Resource');
      expect(canonicalSchemaPath).toBe(
        'paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );

      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: found the path to the canonical schema to be paths./v1/resources/{id}.get.responses.200.content.application/json.schema'
      );
      expect(mockLogger.mock.calls[1][0]).toBe(
        'test: found the name of the canonical schema to be Resource'
      );
    });
  });
});

// Used for negative tests, to make sure that problems with the API definition
// aren't the cause of the test returning an empty object.
function getMockApiDef() {
  return {
    paths: {
      '/v1/resources/{id}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Resource: {
          type: 'object',
        },
      },
    },
  };
}

function getPathToRefsMap() {
  return {
    'paths./v1/resources/{id}.get.responses.200.content.application/json.schema':
      'components.schemas.Resource',
  };
}
