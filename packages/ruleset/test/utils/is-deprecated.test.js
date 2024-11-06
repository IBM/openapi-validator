/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isDeprecated } = require('../../src/utils');

describe('Utility function: isDeprecated()', () => {
  it('should return false if given a non-object', () => {
    expect(isDeprecated('not an object')).toBe(false);
  });

  it('should return false if deprecated field is not set', () => {
    expect(isDeprecated({ type: 'string' })).toBe(false);
  });

  it('should return false if deprecated field is set to false', () => {
    expect(isDeprecated({ type: 'string', deprecated: false })).toBe(false);
  });

  it('should return true if deprecated field is set to true', () => {
    expect(isDeprecated({ type: 'string', deprecated: true })).toBe(true);
  });
});
