#!/usr/bin/env node
const util = require('util');
const fs = require('fs');
const path = require('path');
const readYaml = require('js-yaml');
const last = require('lodash/last');
const chalkPackage = require('chalk');
const jsonValidator = require('json-dup-key-validator');
const globby = require('globby');
const ext = require('./utils/fileExtensionValidator');
const config = require('./utils/processConfiguration');
const buildSwaggerObject = require('./utils/buildSwaggerObject');
const validator = require('./utils/validator');
const print = require('./utils/printResults');
const printJson = require('./utils/printJsonResults');
const printError = require('./utils/printError');
const preprocessFile = require('./utils/preprocessFile');
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');

// default spectral ruleset file
const defaultSpectralRuleset =
  process.cwd() + '/src/spectral/rulesets/.defaultsForSpectral.json';

// import the init module for creating a .validaterc file
const init = require('./utils/init.js');

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

  const limitsFileOverride = program.limits;

  // turn on coloring by default
  const colors = turnOffColoring ? false : true;

  const chalk = new chalkPackage.constructor({ enabled: colors });

  // create an instance of spectral
  const spectral = new Spectral();
  spectral.registerFormat('oas2', isOpenApiv2);
  spectral.registerFormat('oas3', isOpenApiv3);

  // if the 'init' command is given, run the module
  // and exit the program
  if (args[0] === 'init') {
    return await init.printDefaults(chalk);
  }

  // if the 'migrate' command is given, run the module
  // and exit the program
  if (args[0] === 'migrate') {
    return await init.migrate(chalk);
  }

  // otherwise, run the validator on the passed in files
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

  // load the spectral ruleset, either a user's or the default ruleset
  const spectralRuleset = await config.getSpectralRuleset(
    defaultSpectralRuleset
  );

  try {
    await spectral.loadRuleset(spectralRuleset);
  } catch (err) {
    return Promise.reject(err);
  }

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
        // find and fix trailing commas
        const match = originalFile.match(/,\s*[}\]]/m);
        if (match) {
          const chars = originalFile.substring(0, match.index);
          const lineNum = (chars.match(/\n/g) || []).length + 1;
          const msg = `Trailing comma on line ${lineNum} of file ${validFile}.`;
          printError(chalk, chalk.red(msg));
          exitCode = 1;
          originalFile = originalFile.replace(/,(\s*[}\]])/gm, '$1');
        }
        input = JSON.parse(originalFile);
      } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
        input = readYaml.safeLoad(originalFile);
      }

      if (typeof input !== 'object') {
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

    // run validator & spectral, print the results, and determine if validator passed
    let results;
    try {
      // let spectral handle the parsing of the original swagger/oa3 document
      const spectralResults = await spectral.run(originalFile);
      results = validator(swagger, configObject, spectralResults);
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
    }

    if (jsonOutput) {
      printJson(results, originalFile, errorsOnly);
    } else {
      if (results.error || results.warning) {
        print(
          results,
          chalk,
          printValidators,
          reportingStats,
          originalFile,
          errorsOnly
        );
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
            console.log(
              chalk.red(
                `Number of warnings (${numWarnings}) exceeds warnings limit (${
                  limitsObject.warnings
                }).`
              )
            );
          }
        }
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
