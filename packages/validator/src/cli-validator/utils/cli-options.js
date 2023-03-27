/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Command } = require('commander');
const getCopyrightString = require('./get-copyright-string');
const getVersionString = require('./get-version-string');

/**
 * This function is used to gather multi-valued arguments into an array.
 *
 * @param {*} value the value to be added to the previous list
 * @param {*} previous the previous list of values
 * @returns a list containing the previous list items plus the new value
 */
function collect(value, previous) {
  return previous.concat([value]);
}

function parseWarningsLimit(value) {
  let warnings = parseInt(value, 10);
  if (isNaN(warnings)) {
    console.error(
      `error: option '-w, --warnings-limit <number>' argument '${value}' is invalid; using default (-1) instead`
    );
    warnings = -1;
  }
  return warnings;
}

/**
 * This function creates the Command instance that contains a description of
 * all of the validator's command-line options
 * @returns the Command instance
 */
function createCLIOptions() {
  // set up the command line options
  /* prettier-ignore */
  const command = new Command();
  command
    .name('lint-openapi')
    .description('Run the validator on one or more OpenAPI 3.x documents')
    .usage('[options] [file...]')
    .argument('[file...]')
    .option(
      '-c, --config <file>',
      'use configuration stored in <file> (*.json, *.yaml, *.js)'
    )
    .option(
      '-e, --errors-only',
      'include only errors in the output and skip warnings (default is false)'
    )
    .option(
      '-i, --ignore <file>',
      'avoid validating <file> (e.g. -i /dir1/ignore-file1.json --ignore /dir2/ignore-file2.yaml ...) (default is [])',
      collect,
      []
    )
    .option('-j, --json', 'produce JSON output (default is text)')
    .option(
      '-l, --log-level <loglevel>',
      'set the log level for one or more loggers (e.g. -l root=info -l ibm-schema-description-exists=debug ...) ',
      collect,
      []
    )
    .option(
      '-n, --no-colors',
      'disable colorizing of the output (default is false)'
    )
    .option(
      '-r, --ruleset <file>',
      'use Spectral ruleset contained in `<file>` ("default" forces use of default IBM Cloud Validation Ruleset)'
    )
    .option(
      '-s, --summary-only',
      'include only the summary information and skip individual errors and warnings (default is false)'
    )
    .option(
      '-w, --warnings-limit <number>',
      'set warnings limit to <number> (default is -1)',
      parseWarningsLimit
    )
    .version(getVersionString(), '--version')
    .showHelpAfterError()
    .addHelpText('beforeAll', getCopyrightString());

  // Prevent Commander from calling process.exit() for an error.
  // Instead, an exception will be thrown if:
  // - user requests help
  // - user requests version string
  // - user enters an unknown option
  command.exitOverride();

  // Customize message output behavior of Commander.
  // This ensures that Commander's output will end up
  // in the same place as the validator's output
  // and can be captured properly during testing.
  command.configureOutput({
    writeOut: s => console.log(s),
    writeErr: s => console.error(s),
  });

  return command;
}

module.exports = createCLIOptions;
