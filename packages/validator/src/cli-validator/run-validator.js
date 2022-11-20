#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const globby = require('globby');
const isPlainObject = require('lodash/isPlainObject');
const jsonValidator = require('json-dup-key-validator');
const last = require('lodash/last');
const path = require('path');
const readYaml = require('js-yaml');
const util = require('util');

const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');

const addPathsToComponents = require('./utils/add-paths-to-components');
const buildSwaggerObject = require('./utils/build-swagger-object');
const config = require('./utils/process-configuration');
const ext = require('./utils/file-extension-validator');
const preprocessFile = require('./utils/preprocess-file');
const print = require('./utils/print-results');
const printError = require('./utils/print-error');
const { printJson } = require('./utils/json-results');
const spectralValidator = require('../spectral/spectral-validator');
const validator = require('./utils/validator');

// this function processes the input, does the error handling,
//  and acts as the main function for the program
const processInput = async function(program) {
  let args = program.args;

  // require that arguments are passed in
  if (args.length === 0) {
    program.help();
    return Promise.reject(2);
  }

  // interpret the options
  const printValidators = !!program.print_validator_modules;
  const reportingStats = !!program.report_statistics;

  const turnOffColoring = !!program.no_colors;
  const defaultMode = !!program.default_mode;
  const jsonOutput = !!program.json;
  const errorsOnly = !!program.errors_only;
  const debug = !!program.debug;

  const configFileOverride = program.config;
  const rulesetFileOverride = program.ruleset;

  const limitsFileOverride = program.limits;

  const verbose = program.verbose > 0;

  // turn off coloring if explicitly requested
  if (turnOffColoring) {
    chalk.level = 0;
  }

  // run the validator on the passed in files
  // first, process the given files to handle bad input

  // ignore files in .validateignore by comparing absolute paths
  const ignoredFiles = await config.ignore();
  const filteredArgs = args.filter(
    file => !ignoredFiles.includes(path.resolve(file))
  );

  // determine which files were removed from args because they were 'ignored'
  // then, print these for the user. this way, the user is alerted to why files
  // aren't validated
  const filteredFiles = args.filter(file => !filteredArgs.includes(file));
  if (filteredFiles.length) console.log();
  filteredFiles.forEach(filename => {
    console.log(
      chalk.magenta('[Ignored] ') + path.relative(process.cwd(), filename)
    );
  });

  args = filteredArgs;

  // at this point, `args` is an array of file names passed in by the user.
  // nothing in `args` will be a glob type, as glob types are automatically
  // converted to arrays of matching file names by the shell.
  const supportedFileTypes = ['json', 'yml', 'yaml'];
  const filesWithValidExtensions = [];
  let unsupportedExtensionsFound = false;
  args.forEach(arg => {
    if (ext.supportedFileExtension(arg, supportedFileTypes)) {
      filesWithValidExtensions.push(arg);
    } else {
      if (!unsupportedExtensionsFound) console.log();
      unsupportedExtensionsFound = true;
      console.log(
        chalk.yellow('[Warning]') +
          ` Skipping file with unsupported file type: ${arg}`
      );
    }
  });

  if (unsupportedExtensionsFound) {
    console.log(
      chalk.magenta(
        'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
      )
    );
  }

  // globby is used in an unconventional way here. we are not passing in globs,
  // but an array of file names. what globby does is search through the file
  // system looking for files that match the names in the array. it returns a
  // list of matches (file names). Therefore, any files that are in
  // filesWithValidExtensions, but are NOT in the array globby returns, do
  // not actually exist. This is a convenient way of checking for file
  // existence before iterating through and running the validator on
  // every file.
  const filesToValidate = await globby(filesWithValidExtensions);
  const nonExistentFiles = filesWithValidExtensions.filter(
    file => !filesToValidate.includes(file)
  );
  if (nonExistentFiles.length) console.log();
  nonExistentFiles.forEach(file => {
    console.log(
      chalk.yellow('[Warning]') + ` Skipping non-existent file: ${file}`
    );
  });

  // if no passed in files are valid, exit the program
  if (filesToValidate.length === 0) {
    printError(chalk, 'None of the given arguments are valid files.');
    return Promise.reject(2);
  }

  // process the config file for the validations
  let configObject;
  try {
    configObject = await config.get(defaultMode, chalk, configFileOverride);
  } catch (err) {
    return Promise.reject(err);
  }

  // get limits from .thresholdrc file
  let limitsObject;
  try {
    limitsObject = await config.limits(chalk, limitsFileOverride);
  } catch (err) {
    return Promise.reject(err);
  }

  // define an exit code to return. this will tell the parent program whether
  // the validator passed or not
  let exitCode = 0;

  // fs module does not return promises by default
  // create a version of the 'readFile' function that does
  const readFile = util.promisify(fs.readFile);
  let originalFile;
  let input;

  for (const validFile of filesToValidate) {
    if (filesToValidate.length > 1) {
      console.log(
        '\n    ' + chalk.underline(`Validation Results for ${validFile}:`)
      );
    }
    try {
      originalFile = await readFile(validFile, 'utf8');
      originalFile = preprocessFile(originalFile);

      const fileExtension = ext.getFileExtension(validFile);
      if (fileExtension === 'json') {
        input = JSON.parse(originalFile);
      } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
        input = readYaml.safeLoad(originalFile);
      }

      if (!isPlainObject(input)) {
        throw `The given input in ${validFile} is not a valid object.`;
      }

      // jsonValidator looks through the originalFile for duplicate JSON keys
      //   this is checked for by default in readYaml
      const duplicateKeysError = jsonValidator.validate(originalFile);
      if (fileExtension === 'json' && duplicateKeysError) {
        throw duplicateKeysError;
      }
    } catch (err) {
      const description =
        'Invalid input file: ' +
        chalk.red(validFile) +
        '. See below for details.';

      printError(chalk, description, err);
      exitCode = 1;
      continue;
    }

    // change working directory to location of root api definition
    // this will allow the parser in `buildSwaggerObject` to resolve external refs correctly
    const originalWorkingDirectory = process.cwd();
    process.chdir(path.dirname(validFile));

    // validator requires the swagger object to follow a specific format
    let swagger;
    try {
      swagger = await buildSwaggerObject(input);
    } catch (err) {
      printError(chalk, 'There is a problem with the Swagger.', getError(err));
      if (debug) {
        console.log(err.stack);
      }
      exitCode = 1;
      continue;
    } finally {
      // return the working directory to its original location so that
      // the rest of the program runs as expected. using finally block
      // because this must happen regardless of result in buildSwaggerObject
      process.chdir(originalWorkingDirectory);
    }

    // run spectral and save the results
    let spectralResults;
    try {
      const spectral = await spectralValidator.setup(
        rulesetFileOverride,
        debug,
        chalk
      );

      const fileExtension = ext.getFileExtension(validFile);
      let parser = Parsers.Json;
      if (['yaml', 'yml'].includes(fileExtension)) {
        parser = Parsers.Yaml;
      }

      const doc = new Document(originalFile, parser, validFile);
      spectralResults = await spectral.run(doc);
    } catch (err) {
      printError(chalk, 'There was a problem with spectral.', getError(err));
      if (debug || err.message === 'Error running Nimma') {
        printError(chalk, 'Additional error details:');
        console.log(err);
      }
      // this check can be removed once we support spectral overrides
      if (err.message.startsWith('Document must have some source assigned.')) {
        console.log(
          'This error likely occurred because Spectral `exceptions` are deprecated and `overrides` are not yet supported.\n' +
            'Remove these fields from your Spectral config file to proceed.'
        );
      } else if (
        err.message ==
        "Cannot use 'in' operator to search for '**' in undefined"
      ) {
        console.log(
          'This error likely means the API Definition is missing a `servers` field.\n' +
            'Spectral currently has a bug that prevents it from processing a definition without a `servers` field.'
        );
      }
      exitCode = 1;
      continue;
    }

    // run validator, print the results, and determine if validator passed
    let results;
    try {
      results = validator(swagger, configObject, spectralResults, debug);
    } catch (err) {
      printError(chalk, 'There was a problem with a validator.', getError(err));
      if (debug) {
        console.log(err.stack);
      }
      exitCode = 1;
      continue;
    }

    // the warning property tells the user if warnings are included as part of the output
    // if errorsOnly is true, only errors will be returned, so need to force this to false
    if (errorsOnly) {
      results.warning = false;
      results.info = false;
      results.hint = false;
    }

    // fail on errors or if number of warnings exceeds warnings limit
    if (results.error) {
      exitCode = 1;
    } else {
      // Calculate number of warnings and set exit code to 1 if warning limit exceeded
      let numWarnings = 0;
      for (const key of Object.keys(results.warnings)) {
        numWarnings += results.warnings[key].length;
      }
      if (numWarnings > limitsObject.warnings) {
        exitCode = 1;
        // add the exceeded warnings limit as an error
        if (!results.errors) {
          results.errors = {};
        }
        results.errors['warnings-limit'] = [
          {
            path: [],
            message: `Number of warnings (${numWarnings}) exceeds warnings limit (${limitsObject.warnings}).`
          }
        ];
      }
    }

    if (verbose) {
      addPathsToComponents(results, swagger.jsSpec);
    }

    if (jsonOutput) {
      printJson(results, originalFile, verbose, errorsOnly);
    } else {
      if (results.error || results.warning || results.info || results.hint) {
        print(
          results,
          chalk,
          printValidators,
          verbose,
          reportingStats,
          originalFile,
          errorsOnly
        );
      } else {
        console.log(chalk.green(`\n${validFile} passed the validator`));
        if (validFile === last(filesToValidate)) console.log();
      }
    }
  }

  return exitCode;
};

// if the error has a message property (it should),
// this is the cleanest way to present it. If not,
// print the whole error
function getError(err) {
  return err.message || err;
}

// this exports the entire program so it can be used or tested
module.exports = processInput;
