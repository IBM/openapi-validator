require('babel-polyfill');
const chalk = require('chalk');
const config = require('../cli-validator/utils/processConfiguration');
const buildSwaggerObject = require('../cli-validator/utils/buildSwaggerObject');
const validator = require('../cli-validator/utils/validator');
const getOutput = require('./utils/printForMachine');
const getOpenApi = require('../cli-validator/utils/openApiVersion');

module.exports = async function(input, defaultMode = false, version = '2') {
  // determine the openapi version to validate against
  const openApiVersion = getOpenApi(version);

  // process the config file for the validations
  let configObject;
  try {
    configObject = await config.get(defaultMode, chalk);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input, openApiVersion);
  const results = validator(swagger, configObject, openApiVersion);

  // return a json object containing the errors/warnings
  return getOutput(results);
};
