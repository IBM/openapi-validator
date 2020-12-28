const MessageCarrier = require('../../plugins/utils/messageCarrier');
const config = require('../../cli-validator/utils/processConfiguration');
const { Spectral } = require('@stoplight/spectral');
const { isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');
const { mergeRules } = require('@stoplight/spectral/dist/rulesets');
const fs = require('fs');
// default spectral ruleset file
const defaultSpectralRulesetURI =
  __dirname + '/../rulesets/.defaultsForSpectral.yaml';

const parseResults = function(results, debug) {
  const messages = new MessageCarrier();

  if (results) {
    for (const validationResult of results) {
      if (validationResult) {
        const code = validationResult['code'];
        const severity = validationResult['severity'];
        const message = validationResult['message'];
        const path = validationResult['path'];

        if (code === 'parser') {
          // Spectral doesn't allow disabling parser rules, so don't include them
          // in the output (for now)
          continue;
        }

        if (typeof severity === 'number' && code && message && path) {
          if (severity === 0) {
            // error
            messages.addMessage(path, message, 'error', code);
          } else if (severity === 1) {
            // warning
            messages.addMessage(path, message, 'warning', code);
          } else if (severity === 2) {
            // info
            messages.addMessage(path, message, 'info', code);
          } else if (severity === 3) {
            // hint
            messages.addMessage(path, message, 'hint', code);
          }
        } else {
          if (debug) {
            console.log(
              'There was an error while parsing the spectral results: ',
              JSON.stringify(validationResult)
            );
          }
        }
      }
    }
  }
  return messages;
};

// setup: registers the oas2/oas3 formats, and attempts to load the ruleset file
const setup = async function(spectral, rulesetFileOverride, configObject) {
  if (!spectral) {
    const message =
      'Error (spectral-validator): An instance of spectral has not been initialized.';
    return Promise.reject(message);
  }

  // Add IBM default ruleset to static assets to allow extends to reference it
  const staticAssets = require('@stoplight/spectral/rulesets/assets/assets.json');
  const content = fs.readFileSync(defaultSpectralRulesetURI, 'utf8');
  staticAssets['ibm:oas'] = content;
  Spectral.registerStaticAssets(staticAssets);

  // Register formats
  spectral.registerFormat('oas2', isOpenApiv2);
  spectral.registerFormat('oas3', isOpenApiv3);

  // load the spectral ruleset, either a user's or the default ruleset
  const spectralRulesetURI = await config.getSpectralRuleset(
    rulesetFileOverride,
    defaultSpectralRulesetURI
  );

  // Load either the user-defined ruleset or our default ruleset
  await spectral.loadRuleset(spectralRulesetURI);

  // Combine default/user ruleset with the validaterc spectral rules
  // The validaterc rules will take precendence in the case of duplicate rules
  const userRules = Object.assign({}, spectral.rules); // Clone rules
  try {
    return await spectral.setRules(
      mergeRules(userRules, configObject.spectral.rules)
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  parseResults,
  setup
};
