/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Spectral } = require('@stoplight/spectral-core');

/**
 * This is a test utility function that uses spectral to invoke the specified rule
 * on the specified API definition.
 * @param {string} ruleName the name of the rule (e.g. `ibm-string-attributes`)
 * @param {object} rule the rule object
 * @param {any} one of the input values expected by the rule after applying its `given`
 * @param {boolean} exceptionIsExpected if `true`, exceptions are not displayed on console
 */
async function unitTestRule(
  ruleName,
  rule,
  input,
  exceptionIsExpected = false
) {
  const ruleDef = {
    ...rule,
    given: ['$'],
  };

  delete ruleDef.formats;

  try {
    const spectral = new Spectral();
    spectral.setRuleset({
      rules: {
        [ruleName]: ruleDef,
      },
    });

    const results = await spectral.run(input);
    return results;
  } catch (err) {
    if (!exceptionIsExpected) {
      console.error(err);
    }
    throw err;
  }
}

module.exports = unitTestRule;
