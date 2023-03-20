/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Document, Spectral } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const {
  getRuleset,
} = require('@stoplight/spectral-cli/dist/services/linter/utils/getRuleset');
const ibmRuleset = require('@ibm-cloud/openapi-ruleset');
const {
  getFileExtension,
} = require('../cli-validator/utils/file-extension-validator');
const findUp = require('find-up');

/**
 * Creates a Spectral document from the input, runs spectral, converts the results
 * from Spectral to IBM format and returns them.
 *
 * @param {*} opts an object containing the input options
 * @param {*} opts.logger the root logger for displaying messages
 * @param {*} opts.chalk the chalk object used for logging messages
 * @param {*} opts.rulesetFileOverride an optional ruleset filename
 * @param {*} opts.validFile
 * @param {*} opts.originalFile
 * @returns the formatted results
 */
const runSpectral = async function ({ originalFile, validFile }, context) {
  const spectral = await setup(context);

  const fileExtension = getFileExtension(validFile);
  let parser = Parsers.Json;
  if (['yaml', 'yml'].includes(fileExtension)) {
    parser = Parsers.Yaml;
  }

  const doc = new Document(originalFile, parser, validFile);
  const spectralResults = await spectral.run(doc);
  return convertResults(spectralResults, context);
};

function convertResults(spectralResults, { config, logger }) {
  const { errorsOnly, summaryOnly } = config;

  // This structure must match the JSON Schema defined for JSON output
  const finalResultsObject = {
    error: { results: [], summary: { total: 0, entries: [] } },
    warning: { results: [], summary: { total: 0, entries: [] } },
    info: { results: [], summary: { total: 0, entries: [] } },
    hint: { results: [], summary: { total: 0, entries: [] } },
    hasResults: false,
  };

  // use this object to count the occurance of each validation
  const summaryHelper = { error: {}, warning: {}, info: {}, hint: {} };

  for (const r of spectralResults) {
    if (invalidResult(r)) {
      logger.debug(
        'Spectral validation result does not contain necessary information'
      );
      continue;
    }

    const severity = convertSpectralSeverity(r.severity);
    // only collect errors when "errors only" is true
    if (errorsOnly && r.severity > 0) {
      logger.debug(
        `Ignoring result with '${severity}' severity due to 'errors-only' option`
      );
      continue;
    }

    finalResultsObject.hasResults = true;
    finalResultsObject[severity].summary.total++;

    if (!summaryOnly) {
      finalResultsObject[severity].results.push({
        message: r.message,
        path: r.path,
        rule: r.code,
        line: r.range.start.line + 1,
      });
    }

    // compute a generalized message for the summary
    const genMessage = r.message.split(':')[0];
    if (!summaryHelper[severity][genMessage]) {
      summaryHelper[severity][genMessage] = 0;
    }
    summaryHelper[severity][genMessage] += 1;
  }

  // finish putting together the summary object
  for (const sev in summaryHelper) {
    for (const field in summaryHelper[sev]) {
      finalResultsObject[sev].summary.entries.push({
        generalizedMessage: field,
        count: summaryHelper[sev][field],
        percentage: Math.round(
          (summaryHelper[sev][field] / finalResultsObject[sev].summary.total) *
            100
        ),
      });
    }
  }

  return finalResultsObject;
}

/**
 * Creates a new Spectral instance, sets up the ruleset, then returns the spectral instance.
 *
 * @param {*} context an object containing the options
 * @param {*} context.logger the logger to use for logging messages
 * @param {*} context.chalk the chalk object for displaying messages
 * @param {string} context.config.ruleset an optional ruleset filename
 * @returns the new Spectral instance
 */
async function setup({ config, logger }) {
  const spectral = new Spectral();

  // Spectral only supports reading a config file in the working directory,
  // but we support looking up the file path for the nearest file (if one exists).
  let rulesetFileOverride = config.ruleset;
  if (!rulesetFileOverride) {
    rulesetFileOverride = await lookForSpectralRuleset();
  }

  // We'll use the IBM ruleset by default, but also look for a user-provided
  // ruleset and use that if one was specified.
  let ruleset = ibmRuleset;
  try {
    ruleset = await getRuleset(rulesetFileOverride);
    logger.debug(`Using Spectral ruleset file: ${rulesetFileOverride}`);
  } catch (e) {
    // Check error for common issues but do nothing.
    // We get here anytime the user doesn't define a valid Spectral config,
    // which is fine. We just use our default in that case.
    // In certain cases, we help the user understand what is happening by
    // logging informative messages.
    checkGetRulesetError(logger, e);
  }

  spectral.setRuleset(ruleset);

  return spectral;
}

module.exports = {
  runSpectral,
};

function checkGetRulesetError(logger, error) {
  // This first check is to help users migrate to the new version of Spectral.
  // If they try to extend our old ruleset name, Spectral will reject the ruleset.
  // We should let the user know what they need to change.
  if (
    error.message.startsWith('ENOENT: no such file or directory') &&
    error.message.includes('ibm:oas')
  ) {
    logger.warn(
      'The IBM ruleset name has changed and the old name is invalid.'
    );
    logger.warn(
      'Change your ruleset to extend `@ibm-cloud/openapi-ruleset` instead of `ibm:oas`'
    );
    logger.warn(
      'to use your custom ruleset. For now, the IBM Spectral rules will run in their default configuration.'
    );
  } else if (
    error.message.endsWith('Cannot parse null because it is not a string')
  ) {
    logger.debug(
      `No Spectral ruleset file found, using the default IBM Cloud OpenAPI Ruleset.`
    );
  } else {
    logger.debug(
      `Problem reading Spectral ruleset file, using the default IBM Cloud OpenAPI Ruleset. Cause for error:`
    );
    logger.debug(error.message);
  }
}

function invalidResult(r) {
  return !r || !r.code || !r.message || !r.path || invalidSeverity(r.severity);
}

function invalidSeverity(s) {
  return typeof s !== 'number' || s < 0 || s > 3;
}

function convertSpectralSeverity(s) {
  // we have already guaranteed s to be a number, 0-3
  const mapping = { 0: 'error', 1: 'warning', 2: 'info', 3: 'hint' };
  return mapping[s];
}

/**
 * Looks for an instance of one of the standard Spectral ruleset files by
 * navigating up the directory hierarchy starting in the current directory.
 * @returns the name of the ruleset file, or null if no standard
 * spectral ruleset file was found
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
