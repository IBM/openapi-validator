const MessageCarrier = require('../../plugins/utils/messageCarrier');
const config = require('../../cli-validator/utils/processConfiguration');
const { isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');
// default spectral ruleset file
const defaultSpectralRuleset =
  __dirname + '/../rulesets/.defaultsForSpectral.json';

const parseResults = function(results, debug) {
  const messages = new MessageCarrier();

  if (results) {
    for (const validationResult of results) {
      if (validationResult) {
        const code = validationResult['code'];
        const severity = validationResult['severity'];
        const message = validationResult['message'];
        const path = validationResult['path'];

        if (typeof severity === 'number' && code && message && path) {
          if (code === 'parser') {
            // Spectral doesn't allow disabling parser rules, so don't include them
            // in the output (for now)
            continue;
          }
          // Our validator only supports warning/error level, so only include
          // those validation results (for now)
          if (severity === 1) {
            //warning
            messages.addMessage(path, message, 'warning');
          } else if (severity === 0) {
            //error
            messages.addMessage(path, message, 'error');
          }
        } else {
          if (debug) {
            console.log(
              'There was an error while parsing the spectral results: ',
              JSON.stringify(validationResult)
            );
          }
          continue;
        }
      }
    }
  }
  return messages;
};

// setup: registers the oas2/oas3 formats, and attempts to load the ruleset file
const setup = async function(spectral) {
  if (!spectral) {
    const message =
      'Error (spectral-validator): An instance of spectral has not been initialized.';
    return Promise.reject(message);
  }

  spectral.registerFormat('oas2', isOpenApiv2);
  spectral.registerFormat('oas3', isOpenApiv3);

  // load the spectral ruleset, either a user's or the default ruleset
  const spectralRuleset = await config.getSpectralRuleset(
    defaultSpectralRuleset
  );

  try {
    return await spectral.loadRuleset(spectralRuleset);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  parseResults,
  setup
};
