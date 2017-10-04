#!/usr/bin/env node
const program = require('commander');
const cliValidator = require('./runValidator');

// set up the command line options
program
  .usage('[options] <file>')
  .option('-v, --print_validator_modules', 'print the validators that catch each error/warning')
  .option('-n, --no_colors', 'turn off output coloring')
  .parse(process.argv)

cliValidator(program);