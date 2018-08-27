const chalk = require('chalk');
const config = require('../cli-validator/utils/processConfiguration');
const buildSwaggerObject = require('../cli-validator/utils/buildSwaggerObject');
const validator = require('../cli-validator/utils/validator');
const getOutput = require('./utils/printForMachine');

module.exports = async function(input, defaultMode = false) {
  // process the config file for the validations
  let configObject;
  try {
    configObject = await config.get(defaultMode, chalk);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input);
  const results = validator(swagger, configObject);

  // return a json object containing the errors/warnings
  return getOutput(results);
};
