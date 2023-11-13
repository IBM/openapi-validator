/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const semver = require('semver');
const getDefaultRulesetVersion = require('./get-default-ruleset-version.js');

module.exports = checkRulesetVersion;

/**
 * Checks the locally installed version of the IBM Cloud OpenAPI
 * Ruleset (if there is one) against what the default version
 * would be for the current version of the validator tool.
 *
 * If the installed version is older than the default version that
 * comes with the tool, this function returns a warning alerting
 * the user to this fact. We do this because it is possible for a
 * user to continue updating their validator tool version but never
 * seeing the new behavior from later versions of the ruleset because
 * they've fixed their ruleset version locally. This happens silently,
 * so the user may end up in this scenario without being aware of it.
 *
 * @param string local - the semantic version of the locally installed ruleset
 * @returns string|undefined - the warning message, if relevant
 */
function checkRulesetVersion(local) {
  if (!local || typeof local !== 'string') {
    return;
  }

  const defaultVersion = getDefaultRulesetVersion();
  if (semver.lt(local, defaultVersion)) {
    return `Note: local version of the IBM OpenAPI Ruleset is behind the default version, which is ${defaultVersion}.`;
  }

  return;
}
