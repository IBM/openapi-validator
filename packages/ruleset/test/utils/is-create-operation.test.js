/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isCreateOperation } = require('../../src/utils');

describe('Utility function: isCreateOperation', () => {
  it(`should return true if given operation's id starts with 'create'`, () => {
    const operation = {
      operationId: 'create_drink',
    };
    const path = [];
    const apidef = {};
    expect(isCreateOperation(operation, path, apidef)).toBe(true);
  });

  it('should return true if op is a post and there is a resource-specific sibling path', () => {
    const operation = {
      operationId: 'add_drink',
    };
    const path = ['paths', '/v1/drinks', 'post'];
    const apidef = {
      paths: {
        '/v1/drinks': {
          post: {},
        },
        '/v1/drinks/{id}': {},
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(true);
  });

  it('should return false if op is not a post', () => {
    const operation = {
      operationId: 'replace_drink',
    };
    const path = ['paths', '/v1/drinks', 'put'];
    const apidef = {
      paths: {
        '/v1/drinks': {
          put: {},
        },
        '/v1/drinks/{id}': {},
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });

  it('should return false if op is a post but there is no resource-specific sibling path', () => {
    const operation = {
      operationId: 'add_drink',
    };
    const path = ['paths', '/v1/drinks', 'post'];
    const apidef = {
      paths: {
        '/v1/drinks': {
          post: {},
        },
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });

  it('should return false if op is a post on a resource-specific sibling path', () => {
    const operation = {
      operationId: 'do_something_with_a_drink',
    };
    const path = ['paths', '/v1/drinks/{id}', 'post'];
    const apidef = {
      paths: {
        '/v1/drinks/{id}': {
          post: {},
        },
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });

  it('should return false if path is not an array', () => {
    const operation = {
      operationId: 'add_drink',
    };
    const path = 'paths./v1/drinks.post';
    const apidef = {
      paths: {
        '/v1/drinks': {
          post: {},
        },
        '/v1/drinks/{id}': {},
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });

  it('should return false if operation is not an object', () => {
    const operation = undefined;
    const path = ['paths', '/v1/drinks', 'post'];
    const apidef = {
      paths: {
        '/v1/drinks': {
          post: {},
        },
        '/v1/drinks/{id}': {},
      },
    };
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });

  it('should return false if apidef is not an object', () => {
    const operation = {
      operationId: 'add_drink',
    };
    const path = ['paths', '/v1/drinks', 'post'];
    const apidef = null;
    expect(isCreateOperation(operation, path, apidef)).toBe(false);
  });
});
