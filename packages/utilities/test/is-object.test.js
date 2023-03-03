/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('../src');

describe('Utility function: isObject()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isObject([])).toBe(false);
  });

  it('should return `true` for a non-`null`, non-array object', async () => {
    expect(isObject({})).toBe(true);
  });
});
