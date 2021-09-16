const chalk = require('chalk');
const config = require('../cli-validator/utils/processConfiguration');
const buildSwaggerObject = require('../cli-validator/utils/buildSwaggerObject');
const validator = require('../cli-validator/utils/validator');
const { formatResultsAsObject } = require('../cli-validator/utils/jsonResults');
const spectralValidator = require('../spectral/utils/spectral-validator');
const dedupFunction = require('../cli-validator/utils/noDeduplication');
const { Spectral } = require('@stoplight/spectral');

module.exports = async function(input, defaultMode = false, configFileOverride = null) {
  // process the config file for the validations &
  // create an instance of spectral & load the spectral ruleset, either a user's
  // or the default ruleset
  let configObject;
  let spectralResults;
  const spectral = new Spectral({
    computeFingerprint: dedupFunction
  });

  try {
    configObject = await config.get(defaultMode, chalk, configFileOverride);
    await spectralValidator.setup(spectral, null, configObject);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input);

  try {
    spectralResults = await spectral.run(input);
  } catch (err) {
    return Promise.reject(err);
  }
  const results = validator(swagger, configObject, spectralResults);

  // return a json object containing the errors/warnings
  return formatResultsAsObject(results);
};
