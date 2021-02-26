const MessageCarrier = require('../../plugins/utils/messageCarrier');
const config = require('../../cli-validator/utils/processConfiguration');
const { Spectral } = require('@stoplight/spectral');
const { isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');
const { mergeRules } = require('@stoplight/spectral/dist/rulesets');
const yaml = require('js-yaml');
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
// default spectral ruleset file
const defaultSpectralRulesetURI =
  __dirname + '/../rulesets/.defaultsForSpectral.yaml';
const customRulesDirectoryURI = __dirname + '/../rulesets/custom-rules';

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
  const allSpectralRuleURIs = getAllSpectralRulesetURIs();
  const content = JSON.stringify(mergeSpectralRules(allSpectralRuleURIs));
  staticAssets['ibm:oas'] = content;
  Spectral.registerStaticAssets(staticAssets);

  // Register formats
  spectral.registerFormat('oas2', isOpenApiv2);
  spectral.registerFormat('oas3', isOpenApiv3);

  // load the user's spectral ruleset if it exists
  const userSpectralRulesetURI = await config.getUserSpectralRuleset(
    rulesetFileOverride
  );

  // Load either the user-defined ruleset or our default ruleset
  await spectral.loadRuleset(
    userSpectralRulesetURI ? userSpectralRulesetURI : allSpectralRuleURIs
  );

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

function mergeSpectralRules(spectralURIs) {
  const mergedRules = {};
  spectralURIs.forEach(function(uri) {
    // merge the next rule file into the aggregate mergedRules object
    if (fs.lstatSync(uri).isFile()) {
      lodash.merge(mergedRules, yaml.safeLoad(fs.readFileSync(uri, 'utf8')));
    }
  });
  return mergedRules;
}

function getAllSpectralRulesetURIs() {
  const files = [defaultSpectralRulesetURI];
  try {
    // add all paths to custom Spectral rule files
    const filenames = fs.readdirSync(customRulesDirectoryURI);
    filenames.forEach(function(filename) {
      const uri = path.join(customRulesDirectoryURI, filename);
      if (fs.lstatSync(uri).isFile()) {
        files.push(uri);
      }
    });
  } catch (err) {
    console.log('Unable to load custom rules: ' + err);
    return;
  }
  return files;
}

module.exports = {
  parseResults,
  setup
};
