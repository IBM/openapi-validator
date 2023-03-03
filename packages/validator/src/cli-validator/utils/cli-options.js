/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Command, Option } = require('commander');
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
    .description('Run the validator on a specified file')
    .arguments('[<file>]')
    .option('-e, --errors-only', 'only print the errors, ignore the warnings')
    .option('-j, --json', 'output as json')
    .option(
      '-l, --log-level <loglevel>',
      'set the log level for one or more loggers (e.g. -l root=info -l ibm-schema-description=debug ...)',
      collect,
      []
    )
    .option('-n, --no-colors', 'turn off colorizing of the output')
    .option(
      '-r, --ruleset <file>',
      'path to Spectral ruleset file, used instead of .spectral.yaml if provided'
    )
    .option(
      '-s, --summary-only',
      'display only the summary section and skip individual errors/warnings'
    )
    .option('-v, --verbose', 'display verbose results')
    .version(getVersionString(), '--version')
    .showHelpAfterError()
    .addHelpText('beforeAll', getCopyrightString())
    .addOption(
      new Option(
        '--limits <filename',
        'the name of the file containing the limits configuration'
      ).hideHelp()
    );

  return command;
}

module.exports = createCLIOptions;
