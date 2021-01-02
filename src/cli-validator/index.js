#!/usr/bin/env node

// this module enforces that the user is running a supported version
// of Node by exiting the process if the version is less than
// the passed in argument (currently 8.9.x)
require('./utils/checkVersion')('8.9.0');
require('./utils/updateNotifier');

const program = require('./utils/modified-commander');
const cliValidator = require('./runValidator');
const version = require('../../package.json').version;

// set up the command line options
/* prettier-ignore */
program
  .name('lint-openapi')
  .description('Run the validator on a specified file')
  .arguments('[<file>]')
  .option(
    '-c, --config <file>',
    'path to config file, used instead of .validaterc if provided'
  )
  .option(
    '-d, --default_mode',
    'ignore config file and run in default mode'
  )
  .option(
    '-e, --errors_only',
    'only print the errors, ignore the warnings'
  )
  .option(
    '-j, --json',
    'output as json'
  )
  .option(
    '-n, --no_colors',
    'turn off output coloring'
  )
  .option(
    '-p, --print_validator_modules',
    'print the validators that catch each error/warning (helpful for development)'
  )
  .option(
    '-r, --ruleset <file>',
    'path to Spectral ruleset file, used instead of .spectral.yaml if provided'
  )
  .option(
    '-s, --report_statistics',
    'report the frequency of each occurring error/warning'
  )
  .option('-v, --verbose',
    'increase the verbosity of reported results',
    increaseVerbosity,
    0
  )
  .option(
    '--debug',
    'enable debugging output'
  )
  .version(version, '--version');

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

/* prettier-ignore */
program
  .command('init')
  .description('Initialize/reset the .validaterc file');

/* prettier-ignore */
program
  .command('migrate')
  .description('Migrate a .validaterc file from v1 to v2 format.');

program.parse(process.argv);

// run the program
cliValidator(program)
  .then(exitCode => {
    process.exitCode = exitCode;
    return exitCode;
  })
  .catch(err => {
    // if err is 2, it is because the message was caught
    // and printed already
    if (err !== 2) {
      console.log(err);
    }
    process.exitCode = 2;
    return 2;
  });

//
// exitCode/err guide:
//
// exitCode
// 0: the validator finished and passed with no errors/warnings
// 1: the validator finished but there were errors or warnings
//    in the Swagger file
//
// err
// 2: the program encountered an error that prevented
//    the validator from running on all the files
