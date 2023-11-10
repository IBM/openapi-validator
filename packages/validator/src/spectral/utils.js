/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const findUp = require('find-up');

module.exports = {
  findSpectralRuleset,
};

/**
 * Checks the user configuration and the file system for local
 * Spectral config file (aka a local ruleset). If not found,
 * our included default ruleset will be used.
 *
 * @param config - the user-defined config object
 * @param logger - the root logger instance
 * @returns string|null - the path to the local ruleset
 */
async function findSpectralRuleset(config, logger) {
  // Spectral only supports reading a config file in the working directory,
  // but we support looking up the file path for the nearest file (if one exists).
  let rulesetFileOverride = config.ruleset;
  if (!rulesetFileOverride) {
    rulesetFileOverride = await lookForSpectralRuleset();
    if (!rulesetFileOverride) {
      logger.info(
        `No Spectral ruleset file found, using the default IBM Cloud OpenAPI Ruleset.`
      );
    }
  }

  // If '--ruleset default' was specified on command-line, then force the use
  // of our default ruleset.
  if (rulesetFileOverride === 'default') {
    rulesetFileOverride = null;
    logger.info(`Using the default IBM Cloud OpenAPI Ruleset.`);
  }

  return rulesetFileOverride;
}

/**
 * Looks for a local Spectral configuration file based on the
 * names allowed by Spectral. However, unlike Spectral, we will
 * look up the file system for it instead of only the current
 * working directory.
 *
 * @returns string - the path to the local ruleset file
 */
async function lookForSpectralRuleset() {
  // List of ruleset files to search for
  const rulesetFilesToFind = [
    '.spectral.yaml',
    '.spectral.yml',
    '.spectral.json',
    '.spectral.js',
  ];

  let rulesetFile = null;

  // search up the file system for the first ruleset file found
  try {
    for (const file of rulesetFilesToFind) {
      if (!rulesetFile) {
        rulesetFile = await findUp(file);
      }
    }
  } catch {
    // if there's any issue finding a custom ruleset, then return null
    rulesetFile = null;
  }

  return rulesetFile;
}
