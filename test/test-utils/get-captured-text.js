const stripAnsiFrom = require('strip-ansi');

module.exports.getCapturedText = callsToLog =>
  formatCapturedText(callsToLog, false);

module.exports.getCapturedTextWithColor = callsToLog =>
  formatCapturedText(callsToLog, true);

function formatCapturedText(callsToLog, preserveColors) {
  return callsToLog.map(args => {
    // the validator only ever uses the first arg in consolg.log
    const output = preserveColors ? args[0] : stripAnsiFrom(args[0]);

    // the tests expect `console.log()` to be interpreted as a newline
    // but the mock captures the info as `undefined`
    return output === undefined ? '\n' : output;
  });
}
