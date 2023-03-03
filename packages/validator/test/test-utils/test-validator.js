/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const runValidator = require('../../src/cli-validator/run-validator');

/**
 * This function is used by testcases to run the validator via CLI options.
 * It is simply a wrapper that passes on the provided "cliArgs", along
 * with the parse options that will prevent Commander from doing its
 * normal CLI interpretation (i.e. argv[0] is either 'node' or 'electron', etc.).
 * @param {[string]} cliArgs an array of strings representing command-line arguments
 * @returns the exit code returned by the validator
 */
async function testValidator(cliArgs) {
  // Leaving this here for debugging purposes.
  // console.log(`cliArgs: ${cliArgs}`);
  return runValidator(cliArgs, { from: 'user' });
}

module.exports = testValidator;
