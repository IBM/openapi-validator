#!/usr/bin/env node
require("babel-polyfill");
const program = require('commander');
const cliValidator = require('./runValidator');

// set up the command line options
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
  )

program
  .command('init')
  .description('Initialize/reset the .validaterc file')


program.parse(process.argv)

// run the program
cliValidator(program)
  .then(exitCode => {
    return exitCode;
  })
  .catch(err => {
    return err;
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
// 2: the program encountered a runtime error that prevented
//    the validator from running 
