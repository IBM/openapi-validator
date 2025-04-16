/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// NOTE: Duplicated from ruleset package. Need to revisit
const { Spectral } = require('@stoplight/spectral-core');

module.exports = async (rule, doc) => {
  const spectral = new Spectral();

  spectral.setRuleset({
    rules: {
      'mock-rule': rule,
    },
  });

  return await spectral.run(doc);
};
