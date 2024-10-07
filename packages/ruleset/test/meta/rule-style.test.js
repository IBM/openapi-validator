/**
 * Copyright 2022 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const rules = require('../../src/rules');

// Test cases to enforce rule style
describe.each(Object.entries(rules))(
  'Rules conform to required style',
  (name, rule) => {
    it(`${name} rule does not contain implicit .[] recursion`, async () => {
      const implicitRecursionRegex = /\.(?=\[)/;

      if (Array.isArray(rule.given)) {
        // `given` array
        rule.given.map(g => expect(g).not.toMatch(implicitRecursionRegex));
      } else {
        // `given` string
        expect(rule.given).not.toMatch(implicitRecursionRegex);
      }
    });
  }
);
