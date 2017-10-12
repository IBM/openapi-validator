#!/usr/bin/env node
const program = require('commander');
const cliValidator = require('./runValidator');

// set up the command line options
program
  .usage('[options] <file>')
  .option('-v, --print_validator_modules', 'print the validators that catch each error/warning')
  .option('-n, --no_colors', 'turn off output coloring')
  .option('-s, --report_statistics', 'report the frequency of each occuring error/warning')
  .parse(process.argv)

// run the program
cliValidator(program);