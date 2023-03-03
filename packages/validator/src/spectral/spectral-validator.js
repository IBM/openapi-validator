/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Document, Spectral } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const {
  getRuleset
} = require('@stoplight/spectral-cli/dist/services/linter/utils/getRuleset');
const ibmRuleset = require('@ibm-cloud/openapi-ruleset');
const {
  getFileExtension
} = require('../cli-validator/utils/file-extension-validator');
const config = require('../cli-validator/utils/process-configuration');

/**
 * Creates a Spectral document from the input, runs spectral, converts the results
 * from Spectral to IBM format and returns them.
 *
 * @param {*} opts an object containing the input options
 * @returns the formatted results
 */
const runSpectral = async function(opts) {
  const spectral = await setup(
    opts.logger,
    opts.rulesetFileOverride,
    opts.chalk
  );

  const fileExtension = getFileExtension(opts.validFile);
  let parser = Parsers.Json;
  if (['yaml', 'yml'].includes(fileExtension)) {
    parser = Parsers.Yaml;
  }

  const doc = new Document(opts.originalFile, parser, opts.validFile);
  const spectralResults = await spectral.run(doc);
  return convertResults(spectralResults, opts.logger);
};

function convertResults(spectralResults, logger) {
  // This structure must match the JSON Schema defined for JSON output
  const finalResultsObject = {
    error: { results: [], summary: { total: 0, entries: [] } },
    warning: { results: [], summary: { total: 0, entries: [] } },
    info: { results: [], summary: { total: 0, entries: [] } },
    hint: { results: [], summary: { total: 0, entries: [] } },
    has_results: false
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

    finalResultsObject.has_results = true;

    const severity = convertSpectralSeverity(r.severity);
    finalResultsObject[severity].summary.total++;
    finalResultsObject[severity].results.push({
      message: r.message,
      path: r.path,
      rule: r.code,
      line: r.range.start.line + 1
    });

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
        generalized_message: field,
        count: summaryHelper[sev][field],
        percentage: Math.round(
          (summaryHelper[sev][field] / finalResultsObject[sev].summary.total) *
            100
        )
      });
    }
  }

  return finalResultsObject;
}

/**
 * Creates a new spectral instance, sets up the ruleset, then returns the spectral instance.
 *
 * @param {*} logger the logger object used to log messages
 * @param {string} rulesetFileOverride the path to a ruleset as given by an argument
 * @param {*} chalk an object used to colorize messages
 * @returns the spectral instance
 */
async function setup(logger, rulesetFileOverride, chalk) {
  const spectral = new Spectral();

  // spectral only supports reading a config file in the working directory
  // but we support looking up the file path for the nearest file (if one exists)
  if (!rulesetFileOverride) {
    rulesetFileOverride = await config.lookForSpectralRuleset();
  }

  let ruleset = ibmRuleset;
  try {
    ruleset = await getRuleset(rulesetFileOverride);
  } catch (e) {
    // Check error for common issues but do nothing.
    // We get here anytime the user doesnt define a valid spectral config, which is fine.
    // We use our default in that case. In certain cases, we help the user understand
    // the error by logging informative messages.
    checkGetRulesetError(logger, e, chalk);
  }

  spectral.setRuleset(ruleset);

  return spectral;
}

module.exports = {
  runSpectral
};

function checkGetRulesetError(logger, error, chalk) {
  // this first check is to help users migrate to the new version of spectral. if they
  // try to extend our old ruleset name, spectral will reject the ruleset. we should let
  // the user know what they need to change
  if (
    error.message.startsWith('ENOENT: no such file or directory') &&
    error.message.includes('ibm:oas')
  ) {
    logger.warn(
      chalk.yellow('\n[Warning]') +
        ' The IBM ruleset name has changed and the old one is invalid.\n' +
        'Change your ruleset to extend `@ibm-cloud/openapi-ruleset` instead of `ibm:oas`\n' +
        'to use your custom ruleset. For now, the IBM Spectral rules will run in their default configuration.'
    );
  } else if (
    error.message.endsWith('Cannot parse null because it is not a string')
  ) {
    logger.debug(
      `${chalk.magenta(
        '[Info]'
      )} No Spectral config file found, using default IBM Spectral ruleset.`
    );
  } else {
    logger.debug(
      `${chalk.magenta(
        '[Info]'
      )} Problem reading Spectral config file, using default IBM Spectral ruleset. Cause for error:`
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
