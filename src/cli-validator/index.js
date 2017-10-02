#!/usr/bin/env node
const program      = require('commander');
const readYaml     = require('read-yaml');
const readJson     = require('load-json-file');
const last         = require('lodash/last');
const parser       = require('swagger-parser');
const chalkPackage = require('chalk');

// import the validators
const semanticValidators = require('require-all')(__dirname + '/semantic-validators');

// set up the command line options
program
  .usage('[options] <file>')
  .option('-v, --print_validator_modules', 'print the validators that catch each error/warning')
  .option('-n, --no_colors', 'turn off output coloring')
  .parse(process.argv)

// require that exactly one filename is passed in
if (program.args.length !== 1) {
  console.log('\n' + chalkPackage.bgBlack.red('Error') + ' Exactly one file must be passed as an argument. See usage details below:');
  program.help();
}

// interpret the options/arguments
let filePath = program.args[0];
let printValidators = !! program.print_validator_modules;
let turnOffColoring = !! program.no_colors;

// turn on coloring by default
let colors = true;

if (turnOffColoring) {
  colors = false;
}

const chalk = new chalkPackage.constructor({enabled: colors});

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
  process.exit(); 
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
  process.exit();
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
    displayValidationResults(results);
  })
  .catch(err => {
    console.log(err);
  });



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

function displayValidationResults(rawResults) {
  // rawResults = { semantic: [], structural: [] } (for now, just semantic)

  const semantic = rawResults.semantic;

  if (semantic.length) {
    // ...then there are problems in the semantic validators

    const errors = semantic.filter(obj => obj.errors.length);
    const warnings = semantic.filter(obj => obj.warnings.length);

    console.log();
    printInfo(errors, 'errors', 'bgRed');
    printInfo(warnings, 'warnings', 'bgYellow');
  }
}

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
}
