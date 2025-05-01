/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getOffsetParamIndex,
  getPageTokenParamIndex,
  getSuccessCode,
  getResponseSchema,
  getPaginatedOperationFromPath,
} = require('../../src/utils');

describe('Pagination utility functions', () => {
  describe('getOffsetParamIndex()', () => {
    it('should return -1 if an array is not provided', () => {
      expect(getOffsetParamIndex('parameters')).toBe(-1);
    });

    it('should return -1 if there is no parameter named "offset"', () => {
      const parameters = [{ in: 'query', name: 'token' }];
      expect(getOffsetParamIndex(parameters)).toBe(-1);
    });

    it('should return -1 if there is no query parameter named "offset"', () => {
      const parameters = [{ in: 'header', name: 'offset' }];
      expect(getOffsetParamIndex(parameters)).toBe(-1);
    });

    it('should return the index of an offset parameter', () => {
      const parameters = [{ in: 'query', name: 'offset' }];
      expect(getOffsetParamIndex(parameters)).toBe(0);
    });
  });

  describe('getPageTokenParamIndex()', () => {
    it('should return -1 if an array is not provided', () => {
      expect(getPageTokenParamIndex('parameters')).toBe(-1);
    });

    it('should return -1 if there is no token parameter', () => {
      const parameters = [{ in: 'query', name: 'offset' }];
      expect(getPageTokenParamIndex(parameters)).toBe(-1);
    });

    describe.each(['start', 'token', 'cursor', 'page', 'page_token'])(
      'test each allowable token parameter name',
      paramName => {
        it('should return -1 if no token-named query parameters are found', () => {
          const parameters = [{ in: 'header', name: paramName }];
          expect(getPageTokenParamIndex(parameters)).toBe(-1);
        });

        it('should return the index of a token-named query parameter', () => {
          const parameters = [{ in: 'query', name: paramName }];
          expect(getPageTokenParamIndex(parameters)).toBe(0);
        });
      }
    );
  });

  describe('getSuccessCode()', () => {
    it('should return undefined if operation is undefined', () => {
      const operation = undefined;
      expect(getSuccessCode(operation)).toBeUndefined();
    });

    it('should return undefined if operation is an empty object', () => {
      const operation = {};
      expect(getSuccessCode(operation)).toBeUndefined();
    });

    it('should return undefined if operation has no responses', () => {
      const operation = {
        responses: {},
      };
      expect(getSuccessCode(operation)).toBeUndefined();
    });

    it('should return undefined if operation has no success responses', () => {
      const operation = {
        responses: {
          400: {},
        },
      };
      expect(getSuccessCode(operation)).toBeUndefined();
    });

    it('should return the first success code in the operation responses', () => {
      const operation = {
        responses: {
          200: {},
        },
      };
      expect(getSuccessCode(operation)).toBe('200');
    });
  });

  describe('getResponseSchema()', () => {
    it('should return undefined if response is undefined', () => {
      const response = undefined;
      expect(getResponseSchema(response)).toBeUndefined();
    });

    it('should return undefined if response has no content', () => {
      const response = {};
      expect(getResponseSchema(response)).toBeUndefined();
    });

    it('should return undefined if response content is not json', () => {
      const response = {
        content: {
          'application/pdf': {},
        },
      };
      expect(getResponseSchema(response)).toBeUndefined();
    });

    it('should return undefined if json response content has no schema', () => {
      const response = {
        content: {
          'application/json': {},
        },
      };
      expect(getResponseSchema(response)).toBeUndefined();
    });

    it('should return simple json response content schema', () => {
      const schema = { type: 'object' };
      const response = {
        content: {
          'application/json; charset=utf-8': {
            schema,
          },
        },
      };
      expect(getResponseSchema(response)).toEqual(schema);
    });

    it('should return merged json response content schema if it contains an allOf', () => {
      const schema = {
        allOf: [
          {
            type: 'object',
          },
          {
            description: 'a very good object',
          },
        ],
      };
      const response = {
        content: {
          'application/json': {
            schema,
          },
        },
      };
      const mergedSchema = {
        type: 'object',
        description: 'a very good object',
      };
      expect(getResponseSchema(response)).toEqual(mergedSchema);
    });
  });

  describe('getPaginatedOperationFromPath()', () => {
    const mockLogger = jest.fn();
    const logInfo = {
      logger: { debug: mockLogger },
      ruleId: 'test',
    };

    afterEach(() => {
      mockLogger.mockClear();
    });

    it('should return undefined if path is not resource-generic', () => {
      const pathItem = {};
      const path = ['paths', '/v1/resources/{id}'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        "test: 'get' operation is absent or excluded at path '/v1/resources/{id}'"
      );
    });

    it('should return undefined if resource-generic path does not have a get operation', () => {
      const pathItem = {};
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        "test: 'get' operation is absent or excluded at path '/v1/resources'"
      );
    });

    it('should return undefined if get operation has no responses', () => {
      const pathItem = {
        get: {},
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: No success response code found!'
      );
    });

    it('should return undefined if get operation has no success responses', () => {
      const pathItem = {
        get: {
          responses: {
            400: {},
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: No success response code found!'
      );
    });

    it('should return undefined if get operation success response has no schema', () => {
      const pathItem = {
        get: {
          responses: {
            200: {},
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: No response schema found!'
      );
    });

    it('should return undefined if get operation success response schema has no properties', () => {
      const pathItem = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: Resolved response schema has no properties!'
      );
    });

    it('should return undefined if get operation success response schema has no array property', () => {
      const pathItem = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total_count: {
                        type: 'integer',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: Response schema has no array property!'
      );
    });

    it('should return undefined if get operation has no parameters', () => {
      const pathItem = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      resources: {
                        type: 'array',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: Operation has no parameters!'
      );
    });

    it('should return undefined if get operation has no pagination parameters', () => {
      const pathItem = {
        get: {
          parameters: [
            {
              name: 'sort',
              in: 'query',
            },
          ],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      resources: {
                        type: 'array',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const path = ['paths', '/v1/resources'];
      expect(
        getPaginatedOperationFromPath(pathItem, path, logInfo)
      ).toBeUndefined();
      expect(mockLogger.mock.calls[0][0]).toBe(
        'test: No start or offset query param!'
      );
    });

    const paginationParameters = [
      'offset',
      'start',
      'token',
      'cursor',
      'page',
      'page_token',
    ];
    it.each(paginationParameters)(
      'should return operation if it has a pagination query parameter',
      param => {
        const pathItem = {
          get: {
            parameters: [
              {
                name: param,
                in: 'query',
              },
            ],
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        resources: {
                          type: 'array',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
        const path = ['paths', '/v1/resources'];
        expect(getPaginatedOperationFromPath(pathItem, path, logInfo)).toEqual(
          pathItem.get
        );
      }
    );
  });
});
