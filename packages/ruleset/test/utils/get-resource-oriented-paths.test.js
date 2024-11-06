/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResourceOrientedPaths } = require('../../src/utils');

describe('Utility function: getResourceOrientedPaths()', () => {
  it('should return an empty object if given a non-object', () => {
    expect(getResourceOrientedPaths('not an api def')).toEqual({});
  });

  it('should return an empty object if given an api with no paths', () => {
    expect(getResourceOrientedPaths({ openapi: '3.0.0' })).toEqual({});
  });

  it('should return an empty object if given an api with no resource pair paths', () => {
    const api = {
      paths: {
        '/v1/resources': {},
        '/v1/other_resources/{id}': {},
      },
    };

    expect(getResourceOrientedPaths(api)).toEqual({});
  });

  it('should return the resource-paired paths in an api', () => {
    const api = {
      paths: {
        '/v1/resources': {},
        '/v1/resources/{id}': {},
        '/v1/other_resources': {},
        '/v1/custom': {},
        '/v1/other_resources/{id}': {},
        '/v1/resources/{id}/subresources': {},
        '/v1/resources/{id}/subresources/{id}': {},
        '/v1/custom/not_resource_oriented': {},
      },
    };

    expect(getResourceOrientedPaths(api)).toEqual({
      '/v1/resources': '/v1/resources/{id}',
      '/v1/other_resources': '/v1/other_resources/{id}',
      '/v1/resources/{id}/subresources': '/v1/resources/{id}/subresources/{id}',
    });
  });
});
