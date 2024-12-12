/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getCategories,
  getCategoryCoefficient,
} = require('../../src/scoring-tool/categories');

describe('scoring-tool categories tests', function () {
  it('should return the list of supported categories', function () {
    const expectedCategories = [
      'usability',
      'security',
      'robustness',
      'evolution',
    ];
    const actualCategories = getCategories();

    expect(actualCategories.length).toEqual(expectedCategories.length);
    expectedCategories.forEach(c => {
      expect(actualCategories.includes(c)).toBe(true);
    });
  });

  it('should return the correct coefficient for each', function () {
    expect(getCategoryCoefficient('usability')).toBe(1);
    expect(getCategoryCoefficient('security')).toBe(5);
    expect(getCategoryCoefficient('robustness')).toBe(2);
    expect(getCategoryCoefficient('evolution')).toBe(3);
  });
});
