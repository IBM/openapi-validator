/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const testRule = require('./test-rule');

module.exports = async (given, doc) => {
  const visitedPaths = [];
  const rule = {
    given,
    then: {
      function: (input, options, context) => {
        visitedPaths.push(context.path);
        return [];
      },
    },
  };

  await testRule(rule, doc);

  return visitedPaths;
};
