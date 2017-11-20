#!/usr/bin/env node
const util          = require('util');
const fs            = require('fs');
const readYaml      = require('js-yaml');
const last          = require('lodash/last');
const SwaggerParser = require('swagger-parser');
const chalkPackage  = require('chalk');
const jsonValidator = require('json-dup-key-validator');

// import the config processing module
const config = require('./utils/processConfiguration');

// import the circular references handler module
const handleCircularReferences = require('./utils/handleCircularReferences');

// import the validator
const validator = require('./utils/validator');

// import the printing module
const print = require('./utils/printResults');

// get the api schema to perform structural validation against
const apiSchema = require(__dirname + '/../plugins/validation/apis/schema').default;

// this function processes the input, does the error handling,
//  and acts as the main function for the program
const processInput = async function (program) {

  let args = program.args;

  // interpret the options
  const printValidators = !! program.print_validator_modules;
  const reportingStats = !! program.report_statistics;
  
  const turnOffColoring = !! program.no_colors;
  const defaultMode = !! program.default_mode;

  // turn on coloring by default
  let colors = true;

  if (turnOffColoring) {
    colors = false;
  }

  const chalk = new chalkPackage.constructor({enabled: colors});

  // require that exactly one filename is passed in
  if (args.length !== 1) {
    console.log(
      '\n' + chalk.red('Error') + 
      ' Exactly one file must be passed as an argument. See usage details below:'
    );
    program.help();
    return Promise.reject(2);
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
    console.log('\n' + chalk.red('Error') + ' Files must have an extension!');
    badExtension = true;
  }
  else if (!supportedFileTypes.includes(fileExtension)) {
    console.log(
      '\n' + chalk.red('Error') +
      ' Invalid file extension: ' + chalk.red('.' + fileExtension)
    );
    badExtension = true;
  }

  if (badExtension) {
    console.log(
      chalk.magenta('Supported file types are JSON (.json) and YAML (.yml, .yaml)\n')
    );
    return Promise.reject(2); 
  }

  // ensure the file contains a valid json/yaml object before running validator

  // fs module does not return promises by default
  // create a version of the 'readFile' function that does
  const readFile = util.promisify(fs.readFile);
  let originalFile;
  let input;
  try {
    originalFile = await readFile(filePath, 'utf8');

    if (fileExtension === 'json') {
      input = JSON.parse(originalFile)
    }
    else if (fileExtension === 'yaml' || fileExtension === "yml") {
      input = readYaml.safeLoad(originalFile);
    }

    if (typeof input !== 'object') {
      throw `The given input in ${filename} is not a valid object.`;
    }

    // jsonValidator looks through the originalFile string for duplicate JSON keys
    //   this is checked for by default in readYaml
    let duplicateKeysError = jsonValidator.validate(originalFile)
    if (fileExtension === 'json' && duplicateKeysError) {
      throw duplicateKeysError;
    }
  }
  catch (err) {
    console.log(
      '\n' + chalk.red('Error') + 
      ' Invalid input file: ' + chalk.red(filename) + 
      '. See below for details.\n'
    );
    console.log(chalk.magenta(err) + '\n');
    return Promise.reject(2);
  }

  // process the config file for the validations
  let configObject;
  try {
    configObject = await config(defaultMode, chalk);
  } catch (err) {
    return Promise.reject(err);
  }
  

  // initialize an object to be passed through all the validators
  const swagger = {};

  // the structural validation expects a `settings` object
  //  describing which schemas to validate against
  swagger.settings = {
    schemas: [apiSchema],
    testSchema: apiSchema
  };

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
  let parser = new SwaggerParser();
  parser.dereference.circular = false;
  swagger.resolvedSpec = await parser.dereference(input);

  // define an exit code to return. this will tell the parent program whether
  // the validator passed or not
  let exitCode = 0;

  if (parser.$refs.circular) {
    // there are circular references, find them and return an error
    handleCircularReferences(swagger.jsSpec, originalFile, chalk);
    return Promise.reject(2);
  }


  // run validator, print the results, and determine if validator passed
  const results = validator(swagger, configObject);
  if (!results.cleanSwagger) {
    print(results, chalk, printValidators, reportingStats, originalFile);
    exitCode = 1;
  }
  

  return exitCode;
}

// this exports the entire program so it can be used or tested
module.exports = processInput;
