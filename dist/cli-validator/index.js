#!/usr/bin/env node
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var program = require('commander');
var readYaml = require('read-yaml');
var readJson = require('load-json-file');
var last = require('lodash/last');
var parser = require('swagger-parser');

// import the validators
var semanticValidators = require('require-all')(__dirname + '/semantic-validators');

// append a blank line for readability
console.log();

// set up the command line options
program.usage('[options] <file>').option('-e, --errors_only', 'Optional: Print only the errors').parse(process.argv);

// allow only one filename to be passed in
if (program.args.length !== 1) {
  // ***
  // place an additional message here, saying that a file wasnt specified and that's the issue
  program.help();
}

// interpret the options/arguments
// ***
// try to catch unknown options here
var filePath = program.args[0];
var errors_only = !!program.errors_only;

// determine if file is json or yaml by extension
// only allow files with a supported extension
var supportedFileTypes = ['json', 'yml', 'yaml'];
var fileExtension = last(filePath.split('.')).toLowerCase();
var hasExtension = filePath.includes('.');

// ***
// consider throwing a different error here for if no extension is given
// right now, the handling is no bueno. to see why, run the code with 'json' as the argument
if (!hasExtension || !supportedFileTypes.includes(fileExtension)) {
  console.log('Error. Invalid file extension: .' + fileExtension);
  console.log('Supported file types are JSON (.json) and YAML (.yml, .yaml)');
  process.exit();
}

// generate an absolute path if a relative path is given
var isAbsolutePath = filePath[0] === '/';
if (!isAbsolutePath) {
  filePath = process.cwd() + "/" + filePath;
}

// get the actual file name to use in error messages
var filename = last(filePath.split('/'));

// prep a variable to contain either a json or yaml file loader
var loader = null;

// both readJson and readYaml have 'sync' methods for synchronously
//   reading their respective file types
if (fileExtension[0] === 'j') {
  loader = readJson;
} else if (fileExtension[0] === 'y') {
  loader = readYaml;
}

// ensure the file contains a valid json/yaml object before running validator
try {
  var input = loader.sync(filePath);
  if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object') {
    throw 'The given input in ' + filename + ' is not a valid object.';
  }
} catch (err) {
  console.log('Error. Invalid input file: ' + filename + '. See below for details.');
  console.log(err);
  process.exit();
}

// initialize an object to be passed through all the validators
var swagger = {};

// all validations expect an argument with three properties:
// jsSpec, resolvedSpec, and specStr

// formatting the JSON string is necessary for the validations
//  that use it with regular expressions (e.g. refs.js)
var indentationSpaces = 2;
swagger.specStr = JSON.stringify(input, null, indentationSpaces);

// deep copy input to a jsSpec by parsing the spec string.
// setting it equal to 'input' and then calling 'dereference'
// replaces 'input' with the dereferenced object
swagger.jsSpec = JSON.parse(swagger.specStr);

// dereference() resolves all references. it esentially returns the resolvedSpec,
//   but without the $$ref tags (which are not used in the built in validations)
parser.dereference(input).then(function (spec) {
  swagger.resolvedSpec = spec;
}).then(function () {
  var results = validate(swagger);
  displayValidationResults(results);
}).catch(function (err) {
  console.log(err);
});

function validate(allSpecs) {

  // writing this in a way that will make it easier to incorporate structural validations
  var validationResults = {};

  // run semantic validators
  var semanticResults = Object.keys(semanticValidators).map(function (key) {
    var problem = semanticValidators[key].validate(allSpecs);
    problem.validation = key;
    return problem;
  });

  // if there were no errors or warnings, don't bother passing along
  semanticResults = semanticResults.filter(function (res) {
    return res.errors.length || res.warnings.length;
  });

  validationResults.semantic = semanticResults;

  return validationResults;
}

function displayValidationResults(rawResults) {
  // rawResults = { semantic: [], structural: [] }

  var semantic = rawResults.semantic;

  if (semantic.length) {
    // there are problems in the semantic validators
    var errors = semantic.filter(function (obj) {
      return obj.errors.length;
    });
    var warnings = semantic.filter(function (obj) {
      return obj.warnings.length;
    });

    printInfo(errors, "errors");
    printInfo(warnings, "warnings");
  }

  // ***
  // debugging statement
  //console.log(JSON.stringify(rawResults, null, 2));
}

function printInfo(problems, type) {

  if (problems.length) {

    // problems is an array of objects with errors, warnings, and validation properties
    // but none of the errors/warnings properties are empty (depending on what was passed in)

    console.log(type.toUpperCase() + '\n');

    problems.forEach(function (object) {
      console.log('Validator: ' + object.validation);
      object[type].forEach(function (problem) {
        console.log('  Path: ' + problem.path);
        console.log('  Message: ' + problem.message);
        console.log();
      });
    });
  }
}