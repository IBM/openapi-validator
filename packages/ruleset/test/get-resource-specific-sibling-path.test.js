/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResourceSpecificSiblingPath } = require('../src/utils');

describe('Utility function: getResourceSpecificSiblingPath', () => {
  it('should find sibling path when present', () => {
    const path = ['paths', '/v1/things', 'post'];
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
    const path = ['paths', '/v1/things', 'post'];
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

  it('should return undefined when given path already ends in a path parameter', () => {
    const path = ['paths', '/v1/things/{id}', 'get'];
    const apidef = {
      paths: {
        '/v1/things/{id}': {
          get: {},
        },
      },
    };

    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });

  it('should return undefined when path is not an array', () => {
    const path = 'wrong';
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
    const path = ['paths', '/v1/things', 'post'];
    const apidef = 'wrong';
    expect(getResourceSpecificSiblingPath(path, apidef)).toBeUndefined();
  });
});
