const fs = require('fs');
const util = require('util');
const path = require('path');
const globby = require('globby');
const findUp = require('find-up');
const printError = require('./printError');

const defaultObject = require('../../.defaultsForValidator');

// global objects
const readFile = util.promisify(fs.readFile);

const validateConfigObject = function(configObject, chalk) {
  const configErrors = [];
  let validObject = true;

  // temporary fix to account for deprecated rules
  const deprecatedRules = ['no_produces_for_get'];

  // check that all categories are valid
  const allowedCategories = Object.keys(defaultObject);
  const userCategories = Object.keys(configObject);
  userCategories.forEach(function(category) {
    if (!allowedCategories.includes(category)) {
      validObject = false;
      configErrors.push({
        message: `'${category}' is not a valid category.`,
        correction: `Valid categories are: ${allowedCategories.join(', ')}`
      });
      return; // skip rules for invalid category
    }

    // check that all rules are valid
    const allowedRules = Object.keys(defaultObject[category]);
    const userRules = Object.keys(configObject[category]);
    userRules.forEach(function(rule) {
      if (!allowedRules.includes(rule) && !deprecatedRules.includes(rule)) {
        validObject = false;
        configErrors.push({
          message: `'${rule}' is not a valid rule for the ${category} category`,
          correction: `Valid rules are: ${allowedRules.join(', ')}`
        });
        return; // skip statuses for invalid rule
      }

      // check that all statuses are valid (either 'error', 'warning', or 'off')
      const allowedStatusValues = ['error', 'warning', 'off'];
      const userStatus = configObject[category][rule];
      if (!allowedStatusValues.includes(userStatus)) {
        validObject = false;
        configErrors.push({
          message: `'${userStatus}' is not a valid status for the ${rule} rule in the ${category} category.`,
          correction: `For any rule, the only valid statuses are: ${allowedStatusValues.join(
            ', '
          )}`
        });
      }
    });
  });

  // if the object is valid, resolve any missing features
  //   and set all missing statuses to their default value
  if (validObject) {
    const requiredCategories = allowedCategories;
    requiredCategories.forEach(function(category) {
      if (!userCategories.includes(category)) {
        configObject[category] = {};
      }
      const requiredRules = Object.keys(defaultObject[category]);
      const userRules = Object.keys(configObject[category]);
      requiredRules.forEach(function(rule) {
        if (!userRules.includes(rule)) {
          configObject[category][rule] = defaultObject[category][rule];
        }
      });
    });
    configObject.invalid = false;
  } else {
    // if the object is not valid, exit and tell the user why
    const description = `Invalid configuration in ${chalk.underline(
      '.validaterc'
    )} file. See below for details.`;
    const message = [];

    // concatenate all the error messages for the printError module
    configErrors.forEach(function(problem) {
      message.push(
        `\n - ${chalk.red(problem.message)}\n   ${chalk.magenta(
          problem.correction
        )}`
      );
    });

    printError(chalk, description, message.join('\n'));
    configObject.invalid = true;
  }

  return configObject;
};

const getConfigObject = async function(defaultMode, chalk) {
  let configObject;
  // search up the file system for the first instance
  // of the config file
  const configFile = await findUp('.validaterc');

  // if the user does not have a config file, run in default mode and warn them
  // (findUp returns null if it does not find a file)
  if (configFile === null && !defaultMode) {
    console.log(
      '\n' +
        chalk.yellow('[Warning]') +
        ` No ${chalk.underline(
          '.validaterc'
        )} file found. The validator will run in ` +
        chalk.bold.cyan('default mode.')
    );
    console.log(`To configure the validator, create a .validaterc file.`);
    defaultMode = true;
  }

  if (defaultMode) {
    configObject = defaultObject;
  } else {
    try {
      // the config file must be in the root folder of the project
      const fileAsString = await readFile(configFile, 'utf8');
      configObject = JSON.parse(fileAsString);
    } catch (err) {
      // this most likely means there is a problem in the json syntax itself
      const description =
        'There is a problem with the .validaterc file. See below for details.';
      printError(chalk, description, err);
      return Promise.reject(2);
    }

    // validate the user object
    configObject = validateConfigObject(configObject, chalk);
    if (configObject.invalid) {
      return Promise.reject(2);
    }
  }

  return configObject;
};

const getFilesToIgnore = async function() {
  // search up the file system for the first instance
  // of the ignore file
  const ignoreFile = await findUp('.validateignore');

  // if file does not exist, thats fine. it is optional
  if (ignoreFile === null) return [];

  const pathToFile = `${path.dirname(ignoreFile)}/`;

  let filesToIgnore;
  try {
    const fileAsString = await readFile(ignoreFile, 'utf8');

    // convert each glob in ignore file to an absolute path.
    // globby takes args relative to the process cwd, but we
    // want these to stay relative to project root
    // also, ignore any blank lines
    const globsToIgnore = fileAsString
      .split('\n')
      .filter(line => line.trim().length !== 0)
      .map(glob => pathToFile + glob);

    filesToIgnore = await globby(globsToIgnore, {
      expandDirectories: true,
      dot: true
    });
  } catch (err) {
    filesToIgnore = [];
  }

  return filesToIgnore;
};

module.exports.get = getConfigObject;
module.exports.validate = validateConfigObject;
module.exports.ignore = getFilesToIgnore;
