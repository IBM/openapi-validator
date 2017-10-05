#!/usr/bin/env node
const readYaml     = require('read-yaml');
const readJson     = require('load-json-file');
const last         = require('lodash/last');
const parser       = require('swagger-parser');
const chalkPackage = require('chalk');

// import the validators
const semanticValidators = require('require-all')(__dirname + '/semantic-validators');

// set up variables that need to be global
let printValidators = false;
let chalk = undefined;

// this function processes the input, does the error handling, and acts as the main function for the program
const processInput = function (program, callback) {

  let args = program.args;

  // interpret the options
  let turnOffColoring = !! program.no_colors;
  printValidators = !! program.print_validator_modules;
  
  // turn on coloring by default
  let colors = true;

  if (turnOffColoring) {
    colors = false;
  }

  chalk = new chalkPackage.constructor({enabled: colors});

  // require that exactly one filename is passed in
  if (args.length !== 1) {
    console.log('\n' + chalkPackage.bgBlack.red('Error') + ' Exactly one file must be passed as an argument. See usage details below:');
    program.help();
    return;
  }

  // interpret the arguments
  let filePath = args[0];

  // generate an absolute path if a relative path is given
  const isAbsolutePath = filePath[0] === '/';

  if (!isAbsolutePath) {
    filePath = process.cwd() + '/' + filePath;
  }

  // get the actual file name to use in error messages
  const filename = last(filePath.split('/'));


  // determine if file is json or yaml by extension
  // only allow files with a supported extension
  const supportedFileTypes = ['json', 'yml', 'yaml'];
  const fileExtension = last(filename.split('.')).toLowerCase();
  const hasExtension = filename.includes('.');

  let badExtension = false;

  if (!hasExtension) {
    console.log('\n' + chalk.bgBlack.red('Error') + ' Files must have an extension!');
    badExtension = true;
  }
  else if (!supportedFileTypes.includes(fileExtension)) {
    console.log('\n' + chalk.bgBlack.red('Error') + ' Invalid file extension: ' + chalk.red('.' + fileExtension) );
    badExtension = true;
  }

  if (badExtension) {
    console.log(chalk.cyan('Supported file types are JSON (.json) and YAML (.yml, .yaml)\n'));
    return; 
  }

  // prep a variable to contain either a json or yaml file loader
  let loader = null;

  // both readJson and readYaml have 'sync' methods for synchronously
  //   reading their respective file types
  if (fileExtension === 'json') {
    loader = readJson;
  }
  else if (fileExtension === 'yaml' || fileExtension === "yml") {
    loader = readYaml;
  }

  // ensure the file contains a valid json/yaml object before running validator
  try {
    var input = loader.sync(filePath);
    if (typeof input !== 'object') {
      throw `The given input in ${filename} is not a valid object.`;
    }
  }
  catch (err) {
    console.log('\n' + chalk.bgBlack.red('Error') + ' Invalid input file: ' + chalk.red(filename) + '. See below for details.\n');
    console.log(chalk.cyan(err) + '\n');
    return;
  }

  // initialize an object to be passed through all the validators
  let swagger = {};

  // ### all validations expect an object with three properties: ###
  // ###          jsSpec, resolvedSpec, and specStr              ###

  // formatting the JSON string with indentations is necessary for the 
  //   validations that use it with regular expressions (e.g. refs.js)
  const indentationSpaces = 2;
  swagger.specStr = JSON.stringify(input, null, indentationSpaces);

  // deep copy input to a jsSpec by parsing the spec string.
  // just setting it equal to 'input' and then calling 'dereference'
  //   replaces 'input' with the dereferenced object, which is bad
  swagger.jsSpec = JSON.parse(swagger.specStr);

  // dereference() resolves all references. it esentially returns the resolvedSpec,
  //   but without the $$ref tags (which are not used in the validations)
  parser.dereference(input)
    .then(spec => {
      swagger.resolvedSpec = spec;
    })
    .then(() => {
      const results = validateSwagger(swagger);
      const problems = structureValidationResults(results);
      if (problems) {
        printInfo(problems.errors, 'errors', 'bgRed');
        printInfo(problems.warnings, 'warnings', 'bgYellow');
      }
    })
    .then(() => {
      // don't end the function until everything is printed - for testing
      if (callback) {
        callback();
      }
      else {
        return;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

// this function runs the validators on the swagger object
function validateSwagger(allSpecs) {
  
  // use an object to make it easier to incorporate structural validations
  let validationResults = {};

  // run semantic validators
  const semanticResults = Object.keys(semanticValidators).map(key => {
    let problem = semanticValidators[key].validate(allSpecs);
    problem.validation = key;
    return problem
  });

  // if there were no errors or warnings, don't bother passing along
  validationResults.semantic = semanticResults.filter(res => res.errors.length || res.warnings.length);
 
  return validationResults;
}

// this function takes the results from the validation and structures them into a more organized format
function structureValidationResults(rawResults) {
  // rawResults = { semantic: [], structural: [] } (for now, just semantic)
  let structuredResults = {};

  const semantic = rawResults.semantic;

  if (semantic.length) {
    // ...then there are problems in the semantic validators

    structuredResults.errors = semantic.filter(obj => obj.errors.length);
    structuredResults.warnings = semantic.filter(obj => obj.warnings.length);

    console.log();
    return structuredResults;
  }
}

// this function prints all of the output
function printInfo(problems, type, color) {

  if (problems.length) {

    // problems is an array of objects with errors, warnings, and validation properties
    // but none of the type (errors or warnings) properties are empty

    console.log(chalk[color].black.bold(`${type}\n`));

    // convert 'color' from a background color to foreground color
    color = color.slice(2).toLowerCase(); // i.e. 'bgRed' -> 'red'

    problems.forEach(object => {

      if (printValidators) {
        console.log(chalk.underline(`Validator: ${object.validation}`));
      }

      object[type].forEach(problem => {

        // some validators store 'path' as a string, some store it as an array
        // if it is an array, print the array separated with periods for consistency
        let path = problem.path;
        if (Array.isArray(path)) {
          path = path.join('.');
        }

        console.log(chalk[color](`  Path   :   ${path}`));
        console.log(chalk[color](`  Message:   ${problem.message}`));
        console.log();

      });
    });
  }

  return;
}

// this exports the entire program so it can be used or tested
module.exports = processInput;

