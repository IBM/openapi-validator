const chalk = require('chalk');

const buildSwaggerObject = require('../cli-validator/utils/build-swagger-object');
const config = require('../cli-validator/utils/process-configuration');
const {
  formatResultsAsObject
} = require('../cli-validator/utils/json-results');
const spectralValidator = require('../spectral/spectral-validator');
const validator = require('../cli-validator/utils/validator');
const { LoggerFactory } = require('@ibm-cloud/openapi-ruleset/src/utils');

module.exports = async function(
  input,
  defaultMode = false,
  configFileOverride = null,
  debug = false
) {
  // Use a root logger with loglevel "info".
  const loggerFactory = LoggerFactory.newInstance();
  loggerFactory.addLoggerSetting('root', 'info');
  const logger = loggerFactory.getLogger('root');
  if (debug) {
    logger.setLevel('debug');
  }

  // process the config file for the validations &
  // create an instance of spectral & load the spectral ruleset, either a user's
  // or the default ruleset
  let configObject;
  let spectralResults;

  try {
    configObject = await config.get(defaultMode, chalk, configFileOverride);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input);

  try {
    const spectral = await spectralValidator.setup(logger, null, chalk);
    spectralResults = await spectral.run(input);
  } catch (err) {
    return Promise.reject(err);
  }
  const results = validator(logger, swagger, configObject, spectralResults);

  // return a json object containing the errors/warnings
  return formatResultsAsObject(results);
};
