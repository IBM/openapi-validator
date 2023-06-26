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

const configMgr = require('./utils/configuration-manager');
const ext = require('./utils/file-extension-validator');
const preprocessFile = require('./utils/preprocess-file');
const print = require('./utils/print-results');
const { printJson } = require('./utils/json-results');
const { runSpectral } = require('../spectral/spectral-validator');
const getCopyrightString = require('./utils/get-copyright-string');

let logger;

/**
 * This function is the main entry point to the validator.
 * It processes the passed-in cli arguments and performs error handling as needed.
 * @param {*} cliArgs the array of command-line arguments (normally this should be process.argv)
 * @param {*} parseOptions an optional object containing parse options
 * @returns an exitCode that indicates success/failure:
 *    0: The validator ran successfully and passed with no errors
 *    1: The validator ran successfully but there were errors detected in one or more
 *       of the requested files
 *    2: The validator encountered an error that prevented it from validating
 *       one or more of the requested files
 */
async function runValidator(cliArgs, parseOptions = {}) {
  // Process the CLI args to produce a validator context object.
  // This context object will contain all the user input as well as some
  // internal information shared by various components of the validator.
  let context, command;
  try {
    ({ context, command } = await configMgr.processArgs(cliArgs, parseOptions));
  } catch (err) {
    // console.error(`Caught error: `, err);
    // "err" will most likely be a CommanderError of some sort (
    // help was displayed, version string requested, unknown option, etc.)
    // and it should have an "exitCode" field.
    const exitCode = 'exitCode' in err ? err.exitCode : 2;
    return exitCode === 0 ? Promise.resolve(0) : Promise.reject(2);
  }

  logger = context.logger;
  logger.debug(
    `Using validator configuration:\n${JSON.stringify(context.config, null, 2)}`
  );

  // Grab the list of files to validate.
  let args = context.config.files;

  // If no arguments are passed in, then display help text and exit.
  if (args.length === 0) {
    logger.error(`${getCopyrightString()}\n${command.helpInformation()}`);
    return Promise.reject(2);
  }

  // Turn off coloring if requested.
  if (!context.config.colorizeOutput) {
    chalk.level = 0;
  }

  context.chalk = chalk;

  if (context.config.outputFormat !== 'json') {
    console.log(getCopyrightString());
  }

  //
  // Run the validator on the files specified via command-line or config file.
  //

  // Ignore files listed in the config object's "ignoreFiles" field
  // by comparing absolute paths.
  // "filteredArgs" will be "args" minus any ignored files.
  const filteredArgs = args.filter(
    file => !context.config.ignoreFiles.includes(path.resolve(file))
  );

  // Next, display a message for each user-specified file that is being ignored.
  const ignoredFiles = args.filter(file => !filteredArgs.includes(file));
  ignoredFiles.forEach(file => {
    logger.warn('Ignored ' + path.relative(process.cwd(), file));
  });

  args = filteredArgs;

  // At this point, "args" is an array of file names passed in by the user,
  // but with the ignored files removed.
  // Nothing in "args" will be a glob type, as glob types are automatically
  // converted to arrays of matching file names by the shell.
  const supportedFileTypes = ['json', 'yml', 'yaml'];
  const filesWithValidExtensions = [];
  let unsupportedExtensionsFound = false;
  args.forEach(arg => {
    if (ext.supportedFileExtension(arg, supportedFileTypes)) {
      filesWithValidExtensions.push(arg);
    } else {
      unsupportedExtensionsFound = true;
      logger.warn(`Skipping file with unsupported file type: ${arg}`);
    }
  });

  if (unsupportedExtensionsFound) {
    logger.warn('Supported file types are JSON (.json) and YAML (.yml, .yaml)');
  }

  // Globby is used in an unconventional way here.
  // We are not passing in globs, but an array of file names.
  // What globby does is search through the file system looking for files
  // that match the names in the array. It returns a list of matches (file names).
  // Therefore, any files that are in filesWithValidExtensions, but are NOT in the
  // array globby returns, do not actually exist. This is a convenient way of checking for file
  // existence before iterating through and running the validator on every file.
  const filesToValidate = await globby(filesWithValidExtensions);
  const nonExistentFiles = filesWithValidExtensions.filter(
    file => !filesToValidate.includes(file)
  );
  nonExistentFiles.forEach(file => {
    logger.warn(`Skipping non-existent file: ${file}`);
  });

  // If no passed in files are valid, exit the program.
  if (!filesToValidate.length) {
    logger.error('No files to validate.');
    return Promise.reject(2);
  }

  // If multiple files were specified and JSON output is requested, exit with an error.
  if (filesToValidate.length > 1 && context.config.outputFormat === 'json') {
    logger.error(
      'At most one file can be specified when JSON output is requested.'
    );
    return Promise.reject(2);
  }

  // Define an exit code to return. This will tell the parent program whether
  // the validator passed or not.
  let exitCode = 0;

  // The "fs" module does not return promises by default.
  // Create a version of the 'readFile' function that does.
  const readFile = util.promisify(fs.readFile);

  // Validate, then process the results for each file being validated.
  for (const validFile of filesToValidate) {
    let originalFile;
    let input;

    if (context.config.outputFormat != 'json') {
      console.log('');
      console.log(chalk.underline(`Validation Results for ${validFile}:\n`));
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
        throw `The content of '${validFile}' is not a valid object.`;
      }

      // jsonValidator looks through the originalFile for duplicate JSON keys
      //   this is checked for by default in readYaml
      const duplicateKeysError = jsonValidator.validate(originalFile);
      if (fileExtension === 'json' && duplicateKeysError) {
        throw duplicateKeysError;
      }

      if (
        typeof input.openapi !== 'string' ||
        input.openapi.match(/3\.0\.[0-9]+/) === null
      ) {
        throw 'Only OpenAPI 3.0.x documents are currently supported.';
      }
    } catch (err) {
      logError(`Invalid input file: ${validFile}. See below for details.`, err);
      exitCode = 1;
      continue;
    }

    // Run spectral and collect formatted results
    let results;
    try {
      results = await runSpectral({ validFile, originalFile }, context);
    } catch (err) {
      logError('There was a problem with spectral.', getError(err));
      logger.error('Additional error details:');
      logger.error(err);
      exitCode = 1;
      continue;
    }

    // Check to see if we should be passing back a non-zero exit code.
    if (results.error.summary.total) {
      // If we have any errors, then exit code 1 is returned.
      exitCode = 1;
    }

    // If the # of warnings exceeded the warnings limit, then this is an error.
    const numWarnings = results.warning.summary.total;
    const warningsLimit = context.config.limits.warnings;
    if (warningsLimit >= 0 && numWarnings > warningsLimit) {
      exitCode = 1;
      logger.error(
        `Number of warnings (${numWarnings}) exceeds warnings limit (${warningsLimit}).`
      );
    }

    // Now print the results, either JSON or text.
    if (context.config.outputFormat === 'json') {
      printJson(context, results);
    } else {
      if (results.hasResults) {
        print(context, results);
      } else {
        console.log(
          context.chalk.green(`\n${validFile} passed the validator\n`)
        );
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

function logError(description, message = '') {
  logger.error(`${description}`);
  if (message) {
    logger.error(`${message}`);
  }
}

module.exports = runValidator;
