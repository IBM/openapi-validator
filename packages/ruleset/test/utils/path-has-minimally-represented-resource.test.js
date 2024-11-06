/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { pathHasMinimallyRepresentedResource } = require('../../src/utils');

describe('Utility function: pathHasMinimallyRepresentedResource()', () => {
  const path = '/v1/resources';

  it('should return false if path is not a string', () => {
    const api = {
      paths: {},
    };
    expect(pathHasMinimallyRepresentedResource(null, api)).toBe(false);
  });

  it('should return false if api is not an object', () => {
    const api = 'my-api';
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return false if the api has no paths', () => {
    const api = {};
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return false if path is not in the api', () => {
    const api = {
      paths: {},
    };
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return false if path does not have a get operation', () => {
    const api = {
      paths: {
        '/v1/resources': {},
      },
    };
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return false if the get operation on the path does not define responses', () => {
    const api = {
      paths: {
        '/v1/resources': {
          get: {},
        },
      },
    };
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return false if the get operation on the path does not define a 204 response', () => {
    const api = {
      paths: {
        '/v1/resources': {
          get: {
            responses: {
              200: {},
            },
          },
        },
      },
    };
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(false);
  });

  it('should return true if the get operation on the path defines a 204 response', () => {
    const api = {
      paths: {
        '/v1/resources': {
          get: {
            responses: {
              200: {},
              204: {},
            },
          },
        },
      },
    };
    expect(pathHasMinimallyRepresentedResource(path, api)).toBe(true);
  });
});
