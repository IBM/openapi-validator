/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResourceSpecificSiblingPath } = require('../../src/utils');

describe('Utility function: getResourceSpecificSiblingPath', () => {
  it('should find sibling path when present', () => {
    const path = '/v1/things';
    const apidef = {
      paths: {
        '/v1/things': {
          post: {},
        },
        '/v1/things/{id}': {
          get: {},
        },
        '/v1/other_things/{id}': {
          get: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBe(
      '/v1/things/{id}'
    );
  });

  it('should return undefined when sibling path is not present', () => {
    const path = '/v1/things';
    const apidef = {
      paths: {
        '/v1/things': {
          post: {},
        },
        '/v1/other_things/{id}': {
          get: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });

  it('should return undefined when there are no other paths', () => {
    const path = '/v1/things';
    const apidef = {
      paths: {
        '/v1/things': {
          post: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });

  it('should return undefined when given path already ends in a path parameter', () => {
    const path = '/v1/things/{id}';
    const apidef = {
      paths: {
        '/v1/things/{id}': {
          get: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });

  it('should return undefined when path is not a string', () => {
    const path = ['paths', '/v1/things', 'post'];
    const apidef = {
      paths: {
        '/v1/things': {
          post: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });

  it('should return undefined when apidef is not an object', () => {
    const path = '/v1/things';
    const apidef = 'wrong';
    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });
});
