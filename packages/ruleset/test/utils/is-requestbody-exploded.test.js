/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isRequestBodyExploded } = require('../../src/utils');

describe('Utility function: isRequestBodyExploded()', () => {
  describe('Should return false', () => {
    it('undefined requestBody', async () => {
      expect(isRequestBodyExploded(undefined)).toBe(false);
    });

    it('null requestBody', async () => {
      expect(isRequestBodyExploded(null)).toBe(false);
    });

    it('requestBody with no content', async () => {
      expect(isRequestBodyExploded({})).toBe(false);
    });

    it('requestBody schema contains non-JSON content', async () => {
      const body = {
        content: {
          'application/octet-stream': {
            schema: {},
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });

    it('requestBody schema contains both JSON and non-JSON content', async () => {
      const body = {
        content: {
          'application/octet-stream': {
            schema: {
              type: 'string',
            },
          },
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                },
              },
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });

    it('requestBody schema defines additionalProperties', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });

    it('requestBody schema contains oneOf', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              oneOf: [
                {
                  type: 'string',
                },
              ],
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });

    it('requestBody schema contains anyOf', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              anyOf: [
                {
                  type: 'string',
                },
              ],
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });

    it('requestBody schema contains a discriminator', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              discriminator: {},
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(false);
    });
  });

  describe('Should return true', () => {
    it('requestBody schema contains only JSON content', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                },
              },
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(true);
    });

    it('requestBody schema contains allOf', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              allOf: [
                {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(true);
    });

    it('requestBody schema contains empty oneOf', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                },
              },
              oneOf: [],
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(true);
    });

    it('requestBody schema contains empty anyOf', async () => {
      const body = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                },
              },
              anyOf: [],
            },
          },
        },
      };
      expect(isRequestBodyExploded(body)).toBe(true);
    });
  });
});
