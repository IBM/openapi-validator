/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Spectral } = require('@stoplight/spectral-core');

/**
 * This is a test utility function that uses spectral to invoke the specified rule
 * on the specified API definition.
 * @param {*} ruleName the name of the rule (e.g. 'ibm-string-attributes')
 * @param {*} rule the rule object
 * @param {*} apidef the API definition
 * @param {*} exceptionIsExpected if true, exceptions are not displayed on console
 */
async function testRule(ruleName, rule, apidef, exceptionIsExpected = false) {
  try {
    const spectral = new Spectral();
    spectral.setRuleset({
      rules: {
        [ruleName]: rule,
      },
    });

    const results = await spectral.run(apidef);
    return results;
  } catch (err) {
    if (!exceptionIsExpected) {
      console.error(err);
    }
    throw err;
  }
}

module.exports = testRule;
