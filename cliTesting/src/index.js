#!/usr/bin/env node


// chaulk is a good package for coloring cli output

// set up the command line options

var program = require('commander');
program
	.usage('[options] <file>')
	.option('-e, --errors_only', 'Optional: Print only the errors')
	.parse(process.argv)

// allow only one filename to be passed in
if (program.args.length !== 1) {
	program.help();
}

// *** i also want to catch:
// 	1) unknown options
// 	2) files that don't exist
//	3) files that aren't YML or JSON

// interpret the options/arguments
var filename = program.args[0];
var errors_only = !!program.errors_only;

// set up the validator
var validator = require("../dist/validator").validate;


// read from specified file
// *** finding this file needs to be much more robust
// 		I think __dirname could help, and we would just need to append the given file path
var input = require("../"+filename);

var result = validator(input);

if (errors_only) {
	console.log(result.errors);
} else {
	console.log(result.errors);
	console.log(result.warnings)
}



