const { Spectral } = require('@stoplight/spectral-core');
const {
  getRuleset
} = require('@stoplight/spectral-cli/dist/services/linter/utils/getRuleset');
const ibmRuleset = require('@ibm-cloud/openapi-ruleset');
const MessageCarrier = require('../plugins/utils/message-carrier');
const config = require('../cli-validator/utils/process-configuration');
const dedupFunction = require('../cli-validator/utils/custom-deduplication');

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

// setup: creates a new spectral instance, sets up the ruleset, then returns the instance
// `rulesetFileOverride` is a string - the path to a ruleset as given by an argument
// `debug` is a boolean - it indicates that debug information should be printed
const setup = async function(rulesetFileOverride, debug, chalk) {
  const spectral = new Spectral();
  spectral._computeFingerprint = dedupFunction;

  // spectral only supports reading a config file in the working directory
  // but we support looking up the file path for the nearest file (if one exists)
  if (!rulesetFileOverride) {
    rulesetFileOverride = await config.lookForSpectralRuleset();
  }

  let ruleset = ibmRuleset;
  try {
    ruleset = await getRuleset(rulesetFileOverride);
  } catch (e) {
    // check error for common issues but do nothing
    // we get here anytime the user doesnt define a valid spectral config,
    // which is fine. we just use our default in that case.
    // in certain cases, we help the user understand what is happening by
    // logging informative messages
    checkGetRulesetError(e, debug, chalk);
  }

  spectral.setRuleset(ruleset);

  return spectral;
};

module.exports = {
  parseResults,
  setup
};

function checkGetRulesetError(error, debug, chalk) {
  // this first check is to help users migrate to the new version of spectral. if they
  // try to extend our old ruleset name, spectral will reject the ruleset. we should let
  // the user know what they need to change
  if (
    error.message.startsWith('ENOENT: no such file or directory') &&
    error.message.includes('ibm:oas')
  ) {
    console.log(
      chalk.yellow('\n[Warning]') +
        ' The IBM ruleset name has changed and the old one is invalid.\n' +
        'Change your ruleset to extend `@ibm-cloud/openapi-ruleset` instead of `ibm:oas`\n' +
        'to use your custom ruleset. For now, the IBM Spectral rules will run in their default configuration.'
    );
  } else if (
    error.message.endsWith('Cannot parse null because it is not a string')
  ) {
    if (debug) {
      console.log(
        chalk.magenta('\n[Info]') +
          ' No Spectral config file found, using default IBM Spectral ruleset.'
      );
    }
  } else {
    if (debug) {
      console.log(
        chalk.magenta('\n[Info]') +
          ' Problem reading Spectral config file, using default IBM Spectral ruleset. Cause for error:'
      );
      console.log(error.message);
    }
  }
}
