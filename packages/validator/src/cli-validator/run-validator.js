#!/usr/bin/env node
/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const chalk = require('chalk');
const fs = require('fs');
const globby = require('globby');
const isPlainObject = require('lodash/isPlainObject');
const jsonValidator = require('json-dup-key-validator');
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
const { printJson } = require('./utils/json-results');
const spectralValidator = require('../spectral/spectral-validator');
const getCopyrightString = require('./utils/get-copyright-string');
const { LoggerFactory } = require('@ibm-cloud/openapi-ruleset/src/utils');
const createCLIOptions = require('./utils/cli-options');

let logger;

// this function processes the command-line arguments, does the error handling,
//  and acts as the main function for the program
/**
 * This function is the main entry point to the validator.
 * It processes the passed-in cli arguments and performs error handling as needed.
 * @param {*} cliArgs the array of command-line arguments (normally this should be process.argv)
 * @param {*} parseOptions an optional object containing parse options
 */
async function runValidator(cliArgs, parseOptions = {}) {
  const program = createCLIOptions();
  program.parse(cliArgs, parseOptions);

  let args = program.args;

  // If no arguments are passed in, then display help text and exit.
  if (args.length === 0) {
    console.log(`${getCopyrightString()}\n${program.helpInformation()}`);
    return Promise.reject(2);
  }

  // Set default loglevel of the root logger to be 'info'.
  // The user can change this via the command line.
  const loggerFactory = LoggerFactory.getInstance();
  loggerFactory.addLoggerSetting('root', 'info');
  logger = loggerFactory.getLogger('root');

  const opts = program.opts();

  // Retrieve the options.
  const summaryOnly = !!opts.summaryOnly;
  const colorizeOutput = !!opts.colors;
  const jsonOutput = !!opts.json;
  const errorsOnly = !!opts.errorsOnly;
  const rulesetFileOverride = opts.ruleset;
  const verbose = !!opts.verbose;
  const logLevels = opts.logLevel || [];
  const limitsFileOverride = opts.limits;

  // Process each loglevel entry supplied on the command line.
  // Add each option to our LoggerFactory so they can be used to affect the
  // log level of both existing loggers and loggers created later by individual rules.
  // Examples:
  //   -l info  (equivalent to -l root=info)
  //   --log-level ibm-schema-*=debug (enable debug for all rules like "ibm-schema-*")
  //   -l ibm-property-description=debug (enable debug for the "ibm-property-description" rule)
  for (const entry of logLevels) {
    let [loggerName, logLevel] = entry.split('=');

    // No logLevel was parsed (e.g. -l info); assume root logger.
    if (!logLevel) {
      logLevel = loggerName;
      loggerName = 'root';
    }

    loggerFactory.addLoggerSetting(loggerName, logLevel);
  }

  // After setting all the logger-related options on the LoggerFactory,
  // we need to make sure they are applied to any loggers that already exist.
  // It is very unlikely that any loggers exist yet, but just in case... :)
  loggerFactory.applySettingsToAllLoggers();

  // turn off coloring if explicitly requested
  if (!colorizeOutput) {
    chalk.level = 0;
  }

  if (verbose && !jsonOutput) {
    logger.info(chalk.green(getCopyrightString()));
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
  // "filteredArgs" is the list of files to process after removing ignored files
  // "filteredFiles" is the list of files to be ignored
  const filteredFiles = args.filter(file => !filteredArgs.includes(file));
  filteredFiles.forEach(filename => {
    logger.warn(
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
      unsupportedExtensionsFound = true;
      logger.warn(
        chalk.yellow('[Warning]') +
          ` Skipping file with unsupported file type: ${arg}`
      );
    }
  });

  if (unsupportedExtensionsFound) {
    logger.warn(
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
  nonExistentFiles.forEach(file => {
    logger.warn(
      chalk.yellow('[Warning]') + ` Skipping non-existent file: ${file}`
    );
  });

  // if no passed in files are valid, exit the program
  if (!filesToValidate.length) {
    logError(chalk, 'None of the given arguments are valid files.');
    return Promise.reject(2);
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
      logger.info(
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
      logError(
        chalk,
        `Invalid input file: ${chalk.red(validFile)}. See below for details.`,
        err
      );
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
      logError(
        chalk,
        'There is a problem with the API definition.',
        getError(err)
      );
      logger.debug(err.stack);
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
        logger,
        rulesetFileOverride,
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
      logError(chalk, 'There was a problem with spectral.', getError(err));
      logger.error('Additional error details:');
      logger.error(err);
      // this check can be removed once we support spectral overrides
      if (err.message.startsWith('Document must have some source assigned.')) {
        logger.error(
          'This error likely occurred because Spectral `exceptions` are deprecated and `overrides` are not yet supported.\n' +
            'Remove these fields from your Spectral config file to proceed.'
        );
      } else if (
        err.message ==
        "Cannot use 'in' operator to search for '**' in undefined"
      ) {
        logger.error(
          'This error likely means the API Definition is missing a `servers` field.\n' +
            'Spectral currently has a bug that prevents it from processing a definition without a `servers` field.'
        );
      }
      exitCode = 1;
      continue;
    }

    // Convert the spectral results to the form expected by our two "print" functions.
    const results = convertSpectralResults(spectralResults);

    // the warning property tells the user if warnings are included as part of the output
    // if errorsOnly is true, only errors will be returned, so need to force this to false
    // If we are to report only errors, then "hide" warnings, infos and hints.
    if (errorsOnly) {
      results.warning = false;
      results.info = false;
      results.hint = false;
    }

    // Check to see if we should be passing back a non-zero exit code.
    if (results.error) {
      // If we have any errors, then exit code 1 is returned.
      exitCode = 1;
    } else {
      // If the # of warnings exceeded the warnings limit, then this is an error.
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

    // Now print the results, either JSON or text.
    if (jsonOutput) {
      printJson(
        logger,
        results,
        originalFile,
        verbose,
        errorsOnly,
        summaryOnly
      );
    } else {
      if (results.error || results.warning || results.info || results.hint) {
        print(
          logger,
          results,
          chalk,
          verbose,
          summaryOnly,
          originalFile,
          errorsOnly
        );
      } else {
        logger.info(chalk.green(`${validFile} passed the validator`));
      }
    }
  }

  return exitCode;
}

// if the error has a message property (it should),
// this is the cleanest way to present it. If not,
// print the whole error
function getError(err) {
  return err.message || err;
}

function logError(chalk, description, message = '') {
  logger.error(`${chalk.red('[Error]')} ${description}`);
  if (message) {
    logger.error(chalk.magenta(message));
  }
}

/**
 * Converts the raw "spectralResults" into a form suitable for
 * print-results.js and json-results.js.
 * @param {*} logger the validator's root logger
 * @param {*} spectralResults the results returned by Spectral.run
 * @returns the converted results
 */
function convertSpectralResults(spectralResults) {
  const validationResults = {
    errors: {},
    warnings: {},
    infos: {},
    hints: {},
    error: false,
    warning: false,
    info: false,
    hint: false
  };

  const parsedSpectralResults = spectralValidator.parseResults(
    logger,
    spectralResults
  );
  const key = 'spectral';
  if (parsedSpectralResults.errors.length) {
    validationResults.errors[key] = [...parsedSpectralResults.errors];
    validationResults.error = true;
  }
  if (parsedSpectralResults.warnings.length) {
    validationResults.warnings[key] = [...parsedSpectralResults.warnings];
    validationResults.warning = true;
  }
  if (parsedSpectralResults.infos.length) {
    validationResults.infos[key] = [...parsedSpectralResults.infos];
    validationResults.info = true;
  }
  if (parsedSpectralResults.hints.length) {
    validationResults.hints[key] = [...parsedSpectralResults.hints];
    validationResults.hint = true;
  }

  return validationResults;
}

module.exports = runValidator;
