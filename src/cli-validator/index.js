#!/usr/bin/env node
require('babel-polyfill');

// this module enforces that the user is running a supported version
// of Node by exiting the process if the version is less than
// the passed in argument (currently 8.9.x)
require('./utils/enforceVersion')('8.9.0');

const program = require('commander');
const cliValidator = require('./runValidator');

// set up the command line options
/* prettier-ignore */
program
  .description('Run the validator on a specified file')
  .arguments('[<file>]')
  .option(
    '-v, --print_validator_modules',
    'print the validators that catch each error/warning'
  )
  .option(
    '-n, --no_colors',
    'turn off output coloring'
  )
  .option(
    '-d, --default_mode',
    'ignore config file and run in default mode'
  )
  .option(
    '-s, --report_statistics',
    'report the frequency of each occurring error/warning'
  );

/* prettier-ignore */
program
  .command('init')
  .description('Initialize/reset the .validaterc file');

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
