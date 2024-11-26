/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { stripAnsi } = require('./strip-ansi');

module.exports.getCapturedText = callsToLog =>
  formatCapturedText(callsToLog, false);

module.exports.getCapturedTextWithColor = callsToLog =>
  formatCapturedText(callsToLog, true);

function formatCapturedText(callsToLog, preserveColors) {
  return callsToLog.map(args => {
    // the tests expect `console.log()` to be interpreted as a newline
    // but the mock captures the info as `undefined`
    const output = args[0] === undefined ? '\n' : args[0];

    // the validator only ever uses the first arg in consolg.log
    return preserveColors ? output : stripAnsi(output);
  });
}
