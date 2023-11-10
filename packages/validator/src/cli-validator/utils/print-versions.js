/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const getDefaultRulesetVersion = require('./get-default-ruleset-version.js');
const getLocalRulesetVersion = require('./get-local-ruleset-version');
const getVersionString = require('./get-version-string');
const checkRulesetVersion = require('./check-ruleset-version');
const { findSpectralRuleset } = require('../../spectral/utils');

module.exports = printVersions;

/**
 * Prints the "version" strings upon request. It always
 * includes the semantic version of the validator tool
 * itself and if relevant, it includes the semantic
 * version of the IBM Cloud OpenAPI Ruleset that is being
 * executed with the tool. That will either be the default
 * version, which will be explicitly indicated, or it will
 * be the user's locally installed version.
 *
 * @param context object - the local context object
 * @returns void
 */
async function printVersions(context) {
  const versionInfo = await collectVersionInfo(context);

  let output = versionInfo.tool;

  if (versionInfo.ruleset) {
    output += `; ${versionInfo.ruleset}`;
  }

  if (versionInfo.note) {
    output += `\n\n${versionInfo.note}`;
  }

  output += `\n`;

  console.log(output);
}

/**
 * Assembles the information about package versions to print for the user.
 * It retrieves the version of the validator tool, computes the version of
 * the IBM Cloud OpenAPI Ruleset (if being used), and notes any additional
 * information that the user may find relevant to contextualize the version
 * output. It also formats the version strings for printing.
 *
 * @param object - the local context object
 * @returns object - information about local versions
 *          .tool - the version string for the validator CLI tool
 *          .ruleset - the version string for the IBM ruleset (optional)
 *          .note - a message providing additional info for the user (optional)
 */
async function collectVersionInfo({ config, logger }) {
  // Collect the version information in this object to return
  // as the result of this function.
  const versionInfo = {};

  // Add the tool version, which is always guaranteed to be present.
  versionInfo.tool = getVersionString();

  // Add the IBM ruleset version, if it is being used. Include a note if not.
  const localRuleset = await findSpectralRuleset(config, logger);

  if (localRuleset) {
    const rulesetVersion = await getLocalRulesetVersion(localRuleset, logger);
    if (rulesetVersion) {
      versionInfo.ruleset = `ruleset: ${rulesetVersion}`;

      // Check to see if the ruleset is locally installed and if so, add a note
      // if the local version is behind what the default version would be for
      // the current version of the tool.
      const versionWarning = checkRulesetVersion(rulesetVersion);
      if (versionWarning) {
        versionInfo.note = versionWarning;
      }
    }
  } else {
    // If the user isn't using a custom, local ruleset
    // we will use our default ruleset.
    versionInfo.ruleset = `ruleset: ${getDefaultRulesetVersion()} (default)`;
  }

  if (!versionInfo.ruleset) {
    // Add a note explaining why a ruleset version is not included in the output.
    versionInfo.note =
      'Note: ruleset version not included because IBM OpenAPI Ruleset is not being used.';
  }

  return versionInfo;
}
