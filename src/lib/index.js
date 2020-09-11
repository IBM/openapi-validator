const chalk = require('chalk');
const config = require('../cli-validator/utils/processConfiguration');
const buildSwaggerObject = require('../cli-validator/utils/buildSwaggerObject');
const validator = require('../cli-validator/utils/validator');
const getOutput = require('./utils/printForMachine');
const spectralValidator = require('../spectral/utils/spectral-validator');
const { Spectral } = require('@stoplight/spectral');
const fs = require('fs');
const util = require('util');
const preprocessFile = require('../cli-validator/utils/preprocessFile');

module.exports = async function(input, defaultMode = false) {
  // process the config file for the validations &
  // create an instance of spectral & load the spectral ruleset, either a user's
  // or the default ruleset
  let configObject;
  let spectralResults;
  const spectral = new Spectral();

  try {
    await spectralValidator.setup(spectral);
    configObject = await config.get(defaultMode, chalk);
  } catch (err) {
    return Promise.reject(err);
  }

  const swagger = await buildSwaggerObject(input);

  try {
    if (typeof input !== 'object') {
      // If input is not an object, assume it's a file
      const readFile = util.promisify(fs.readFile);
      input = await readFile(input, 'utf8');
      input = preprocessFile(input);
    }
    spectralResults = await spectral.run(input);
  } catch (err) {
    return Promise.reject(err);
  }
  const results = validator(swagger, configObject, spectralResults);

  // return a json object containing the errors/warnings
  return getOutput(results);
};
