/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isOperationOfType } = require('../../src/utils');

describe('Utility function: isOperationOfType', () => {
  it('should return `true` when path matches the given type', () => {
    expect(isOperationOfType('get', ['paths', '/v1/things', 'get'])).toBe(true);
  });

  it('should return `false` when path does not match the given type', () => {
    expect(isOperationOfType('post', ['paths', '/v1/things', 'get'])).toBe(
      false
    );
  });

  it('should return `false` when type is not a string', () => {
    expect(isOperationOfType(42, ['paths', '/v1/things', 'get'])).toBe(false);
  });

  it('should return `false` when path is not an array', () => {
    expect(isOperationOfType('get', 'not an array')).toBe(false);
  });
});
