/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Document, Spectral } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const {
  getRuleset,
} = require('@stoplight/spectral-cli/dist/services/linter/utils/getRuleset');
const ibmRuleset = require('@ibm-cloud/openapi-ruleset');

const {
  checkRulesetVersion,
  getFileExtension,
  getLocalRulesetVersion,
} = require('../cli-validator/utils');

const { findSpectralRuleset } = require('./utils');

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

  // Save the resolved API definition for use in the scoring tool logic.
  context.apiDefinition = doc.data;

  return convertResults(spectralResults, context);
};

function convertResults(spectralResults, { config, logger }) {
  const { errorsOnly } = config;

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

    finalResultsObject[severity].results.push({
      message: r.message,
      path: r.path,
      rule: r.code,
      line: r.range.start.line + 1,
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

  // We'll use the IBM ruleset by default, but also look for a user-provided
  // ruleset and use that if one was specified.
  let ruleset = ibmRuleset;

  const rulesetFileOverride = await findSpectralRuleset(config, logger);
  if (rulesetFileOverride) {
    try {
      ruleset = await getRuleset(rulesetFileOverride);
      logger.debug(`Using Spectral ruleset file: ${rulesetFileOverride}`);

      // Check the local ruleset version and warn
      // the user if they are behind the default.
      const rulesetVersion = await getLocalRulesetVersion(
        rulesetFileOverride,
        logger
      );
      const versionWarning = checkRulesetVersion(rulesetVersion);
      if (versionWarning) {
        logger.warn(versionWarning);
      }
    } catch (e) {
      // Check error for common issues but do nothing.
      // We get here anytime the user doesn't define a valid Spectral config,
      // which is fine. We just use our default in that case.
      // In certain cases, we help the user understand what is happening by
      // logging informative messages.
      checkGetRulesetError(logger, e, rulesetFileOverride);
    }
  }

  spectral.setRuleset(ruleset);

  return spectral;
}

module.exports = {
  runSpectral,
};

function checkGetRulesetError(logger, error, file) {
  const isAggregateError = error instanceof AggregateError;

  // Report the error, then check if some additional hints might be needed.
  logger.error(
    `${
      isAggregateError ? 'Problems' : 'Problem'
    } reading Spectral ruleset file '${file}': ${error.message}`
  );

  // Spectral may report an "AggregateError", which could contain multiple errors
  // and will hide the "message" fields within the individual errors.
  if (isAggregateError) {
    error.errors.forEach(err => {
      // If a validation path is returned, it should be helpful to the user. This formats the path
      // to add it to the message, e.g. "(rules.enum-case-convention.then)".
      const errorPathInRuleset = err.path
        ? ' (' + err.path.join('.') + ')'
        : '';

      logger.error(`- ${err.message}${errorPathInRuleset}`);
    });
    logger.debug(
      'Spectral returned an `AggregateError`. The ruleset likely did not pass validation.'
    );
  }

  logger.error(`Using the default IBM Cloud OpenAPI Ruleset instead.`);

  if (
    error.message.startsWith('ENOENT: no such file or directory') &&
    error.message.includes('ibm:oas')
  ) {
    logger.warn(
      'The IBM ruleset name has changed and the old name is invalid.'
    );
    logger.warn(
      'Change your ruleset to extend `@ibm-cloud/openapi-ruleset` instead of `ibm:oas` to use your custom ruleset.'
    );
    logger.warn(
      'For now, the IBM Spectral rules will run in their default configuration.'
    );
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
