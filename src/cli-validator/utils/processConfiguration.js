const fs = require('fs');
const util = require('util');
const path = require('path');
const globby = require('globby');
const findUp = require('find-up');
const printError = require('./printError');

const defaultConfig = require('../../.defaultsForValidator');

// global objects
const readFile = util.promisify(fs.readFile);
const defaultObject = defaultConfig.defaults;
// Clear spectral rules from defaultObject, only use the explicit values in the validaterc file
defaultObject.spectral.rules = {};
const deprecatedRuleObject = defaultConfig.deprecated;
const configOptions = defaultConfig.options;

const printConfigErrors = function(problems, chalk, fileName) {
  const description = `Invalid configuration in ${chalk.underline(
    fileName
  )} file. See below for details.`;

  const message = [];

  // add all errors for printError
  problems.forEach(function(problem) {
    message.push(
      `\n - ${chalk.red(problem.message)}\n   ${chalk.magenta(
        problem.correction
      )}`
    );
  });
  if (message.length) {
    printError(chalk, description, message.join('\n'));
  }
};

const validateExclusionsConfig = (configObject,configErrors) => {
  //TODO more validation 
  if(configObject.exclude)
  {
    const paths = Object.keys(configObject.exclude)
    paths.forEach((path) => {
      if(!Array.isArray(configObject.exclude[path]))
      {
        configErrors.push({
          message: `Excluded path:${path} must specify an array of excluded rules`,
          correction: `Change "${configObject.exclude[path]}" to be an array of named rules`
        });
      }
    })
  }
}

const validateConfigObject = function(configObject, chalk) {
  const configErrors = [];

  const deprecatedRules = Object.keys(deprecatedRuleObject);

  const allowedSpecs = Object.keys(defaultObject);

  // Validate path exclusions first as they are a different format to rule configurations
  validateExclusionsConfig(configObject,configErrors)

  //Get remaining config keys but not the excluded paths
  const userSpecs = Object.keys(configObject).filter((value)=>{return value!=='exclude'});
  userSpecs.forEach(spec => {
    // Do not check "spectral" spec rules
    if (spec === 'spectral') {
      return;
    }
    if (!allowedSpecs.includes(spec)) {
      configErrors.push({
        message: `'${spec}' is not a valid spec.`,
        correction: `Valid specs are: ${allowedSpecs.join(', ')}`
      });
      return; // skip rules for categories for invalid spec
    }

    // check that all categories are valid
    const allowedCategories = Object.keys(defaultObject[spec]);
    const userCategories = Object.keys(configObject[spec]);
    userCategories.forEach(category => {
      if (!allowedCategories.includes(category)) {
        configErrors.push({
          message: `'${category}' is not a valid category.`,
          correction: `Valid categories are: ${allowedCategories.join(', ')}`
        });
        return; // skip rules for invalid category
      }

      // check that all rules are valid
      const allowedRules = Object.keys(defaultObject[spec][category]);
      const userRules = Object.keys(configObject[spec][category]);
      userRules.forEach(rule => {
        if (
          deprecatedRules.includes(rule) ||
          // account for rules with same name in different categories
          deprecatedRules.includes(`${category}.${rule}`)
        ) {
          const oldRule = deprecatedRules.includes(rule)
            ? rule
            : `${category}.${rule}`;

          const newRule = deprecatedRuleObject[oldRule];
          const message =
            newRule === ''
              ? `The rule '${oldRule}' has been deprecated. It will not be checked.`
              : `The rule '${oldRule}' has been deprecated. It will not be checked. Use '${newRule}' instead.`;
          console.log('\n' + chalk.yellow('[Warning] ') + message);
          delete configObject[spec][category][rule];
          return;
        } else if (!allowedRules.includes(rule)) {
          configErrors.push({
            message: `'${rule}' is not a valid rule for the ${category} category`,
            correction: `Valid rules are: ${allowedRules.join(', ')}`
          });
          return; // skip statuses for invalid rule
        }

        // check that all statuses are valid (either 'error', 'warning', 'info', 'hint' or 'off')
        const allowedStatusValues = ['error', 'warning', 'info', 'hint', 'off'];
        let userStatus = configObject[spec][category][rule];

        // if the rule supports an array in configuration,
        // it will be an array in the defaults object
        const defaultStatus = defaultObject[spec][category][rule];
        const ruleTakesArray = Array.isArray(defaultStatus);
        const userGaveArray = Array.isArray(userStatus);

        if (ruleTakesArray) {
          const userStatusArray = userGaveArray ? userStatus : [userStatus];
          userStatus = userStatusArray[0] || '';
          const configOption = userStatusArray[1] || defaultStatus[1];
          if (configOption !== defaultStatus[1]) {
            const result = validateConfigOption(configOption, defaultStatus[1]);
            if (!result.valid) {
              configErrors.push({
                message: `'${configOption}' is not a valid option for the ${rule} rule in the ${category} category.`,
                correction: `Valid options are: ${result.options.join(', ')}`
              });
            }
          }
          configObject[spec][category][rule] = [userStatus, configOption];
        } else if (userGaveArray) {
          // user should not have given an array
          // dont throw two errors
          userStatus = 'off';
          configErrors.push({
            message: `Array-value configuration options are not supported for the ${rule} rule in the ${category} category.`,
            correction: `Valid statuses are: ${allowedStatusValues.join(', ')}`
          });
        }
        if (!allowedStatusValues.includes(userStatus)) {
          configErrors.push({
            message: `'${userStatus}' is not a valid status for the ${rule} rule in the ${category} category.`,
            correction: `Valid statuses are: ${allowedStatusValues.join(', ')}`
          });
        }
      });
    });
  });

  // if the object is valid, resolve any missing features
  //   and set all missing statuses to their default value
  if (!configErrors.length) {
    const requiredSpecs = allowedSpecs;
    requiredSpecs.forEach(spec => {
      if (!userSpecs.includes(spec)) {
        configObject[spec] = {};
      }
      const requiredCategories = Object.keys(defaultObject[spec]);
      const userCategories = Object.keys(configObject[spec]);
      requiredCategories.forEach(category => {
        if (!userCategories.includes(category)) {
          configObject[spec][category] = {};
        }
        const requiredRules = Object.keys(defaultObject[spec][category]);
        const userRules = Object.keys(configObject[spec][category]);
        requiredRules.forEach(rule => {
          if (!userRules.includes(rule)) {
            configObject[spec][category][rule] =
              defaultObject[spec][category][rule];
          }
        });
      });
    });
    configObject.invalid = false;
  } else {
    // if the object is not valid, exit and tell the user why
    printConfigErrors(configErrors, chalk, '.validaterc');

    configObject.invalid = true;
  }

  return configObject;
};

const getConfigObject = async function(defaultMode, chalk, configFileOverride) {
  let configObject;

  const findUpOpts = {};
  let configFileName;

  // You cannot pass a full path into findUp as a file name, you must split the
  // path or else findUp redudantly prepends the path to the result.
  if (configFileOverride) {
    configFileName = path.basename(configFileOverride);
    findUpOpts.cwd = path.dirname(configFileOverride);
  } else {
    configFileName = '.validaterc';
  }

  // search up the file system for the first instance
  // of '.validaterc' or,
  // if a config file override is passed in, use find-up
  // to verify existence of the file
  const configFile = await findUp(configFileName, findUpOpts);

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

const validateLimits = function(limitsObject, chalk) {
  const allowedLimits = ['warnings'];
  const limitErrors = [];

  Object.keys(limitsObject).forEach(function(key) {
    if (!allowedLimits.includes(key)) {
      // remove the entry and notify the user
      delete limitsObject[key];
      limitErrors.push({
        message: `"${key}" limit not supported. This value will be ignored.`,
        correction: `Valid limits for .thresholdrc are: ${allowedLimits.join(
          ', '
        )}.`
      });
    } else {
      // valid limit option, ensure the limit given is a number
      if (typeof limitsObject[key] !== 'number') {
        // remove the entry and notify the user
        delete limitsObject[key];
        limitErrors.push({
          message: `Value provided for ${key} limit is invalid.`,
          correction: `${key} limit should be a number.`
        });
      }
    }
  });

  // give the user corrections for .thresholdrc file
  if (limitErrors.length) {
    printConfigErrors(limitErrors, chalk, '.thresholdrc');
  }

  //  sets all limits options not defined by user to default
  for (const limitOption of allowedLimits) {
    if (!(limitOption in limitsObject)) {
      limitsObject[limitOption] = Number.MAX_VALUE;
    }
  }

  return limitsObject;
};

const getLimits = async function(chalk, limitsFileOverride) {
  let limitsObject = {};

  const findUpOpts = {};
  let limitsFileName;

  if (limitsFileOverride) {
    limitsFileName = path.basename(limitsFileOverride);
    findUpOpts.cwd = path.dirname(limitsFileOverride);
  } else {
    limitsFileName = '.thresholdrc';
  }

  // search up the file system for the first instance
  // of the threshold file
  const limitsFile = await findUp(limitsFileName, findUpOpts);

  if (limitsFile !== null) {
    try {
      const fileAsString = await readFile(limitsFile, 'utf8');
      limitsObject = JSON.parse(fileAsString);
    } catch (err) {
      // this most likely means there is a problem in the json syntax itself
      const description =
        'There is a problem with the .thresholdrc file. See below for details.';
      printError(chalk, description, err);
      return Promise.reject(2);
    }
  }

  // returns complete limits object with all valid user settings
  // and default values for undefined limits
  limitsObject = validateLimits(limitsObject, chalk);

  return limitsObject;
};

const validateConfigOption = function(userOption, defaultOption) {
  const result = { valid: true };
  // determine what type of option it is
  let optionType;
  Object.keys(configOptions).forEach(option => {
    if (configOptions[option].includes(defaultOption)) {
      optionType = option;
    }
  });
  // if optionType doesn't match, there are no predefined options for this rule
  if (!optionType) {
    return result;
  }
  // verify the given option is valid
  const validOptions = configOptions[optionType];
  if (!validOptions.includes(userOption)) {
    result.valid = false;
    result.options = validOptions;
  }

  return result;
};

const getSpectralRuleset = async function(rulesetFileOverride, defaultRuleset) {
  // List of ruleset files to search for
  const ruleSetFilesToFind = [
    '.spectral.yaml',
    '.spectral.yml',
    '.spectral.json'
  ];
  if (rulesetFileOverride) {
    ruleSetFilesToFind.splice(0, 0, rulesetFileOverride);
  }
  let ruleSetFile;

  // search up the file system for the first ruleset file found
  try {
    for (const file of ruleSetFilesToFind) {
      if (!ruleSetFile) {
        ruleSetFile = await findUp(file);
      }
    }
  } catch {
    // if there's any issue finding a custom ruleset, then
    // just use the default
    ruleSetFile = defaultRuleset;
  }

  if (!ruleSetFile) {
    ruleSetFile = defaultRuleset;
  }

  return ruleSetFile;
};

module.exports.get = getConfigObject;
module.exports.validate = validateConfigObject;
module.exports.ignore = getFilesToIgnore;
module.exports.validateOption = validateConfigOption;
module.exports.validateLimits = validateLimits;
module.exports.limits = getLimits;
module.exports.getSpectralRuleset = getSpectralRuleset;
