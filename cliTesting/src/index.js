#!/usr/bin/env node
var program = require('commander');
var readYaml = require('read-yaml');
var readJson = require('load-json-file');
var last = require('lodash/last');

// import the validators
var validators = require('require-all')(__dirname + '/validators');

// set up the command line options
program
  .usage('[options] <file>')
  .option('-e, --errors_only', 'Optional: Print only the errors')
  .parse(process.argv)

// allow only one filename to be passed in
if (program.args.length !== 1) {
  // place an additional message here, saying that a file wasnt specified and that's the issue
  program.help();
}



// *** i also want to catch:
//  1) unknown options


// interpret the options/arguments
// try to catch unknown options here

var filePath = program.args[0];
var errors_only = !!program.errors_only;



// determine if file is json or yaml by extension
// only allow files with a supported extension
let supportedFileTypes = ['json', 'yml', 'yaml'];
let fileExtension = last(filePath.split('.')).toLowerCase();
let hasExtension = filePath.includes('.');

// *** consider throwing a different error here for if no extension is given
// right now, the handling is no bueno. to see why, run the code with 'json' as the argument

if (!hasExtension || !supportedFileTypes.includes(fileExtension)) {
  console.log(`Error. Invalid file extension: .${fileExtension}`);
  console.log('Supported file types are JSON (.json) and YAML (.yml, .yaml)');
  process.exit();
}

// generate an absolute path if not already
let isAbsolutePath = filePath[0] === '/';

if (!isAbsolutePath) {
  filePath = process.cwd() + "/" + filePath;
}

// get the actual file name to use in error messages
var filename = last(filePath.split('/'));

// prep a variable to contain either a json or yaml file loader
var loader = null;

if (fileExtension[0] === 'j') {
  loader = readJson;
}
else if (fileExtension[0] === 'y') {
  loader = readYaml;
}
// both readJson and readYaml have 'sync' methods for synchronously
//   reading their respective file types


// ensure the file contains a valid json/yaml object before running validator
try {
  var swagger = loader.sync(filePath);
  if (typeof swagger !== 'object') {
    throw `The given input in ${filename} is not a valid object.`;
  }
}
catch (err) {
  console.log(`Error. Invalid input file: ${filename}. See below for details.`);
  console.log(err);
  process.exit();
}

var input = {"jsSpec": {}};
input.jsSpec = swagger;


// validate!

Object.keys(validators).forEach(function(key) {
  console.log(key);
  console.log(validators[key].validate(input));
});

//console.log(result);



