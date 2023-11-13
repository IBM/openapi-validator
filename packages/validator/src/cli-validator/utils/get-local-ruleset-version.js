/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const findUp = require('find-up');
const { dirname, join } = require('path');

module.exports = getLocalRulesetVersion;

/**
 * Looks for a locally installed version of the IBM Cloud OpenAPI
 * Ruleset package. It mimics the behavior of Spectral's local
 * module lookup by seeking up the file system for a `node_modules/`
 * directory that contains the package. If we find it, we try to
 * extract the version from the `package.json` file and return it.
 *
 * @param string directory - the path to the user's local ruleset
 * @param object logger - the root logger instance
 * @returns string - the semantic version, if found. empty string, if not.
 */
async function getLocalRulesetVersion(localRuleset, logger) {
  if (!localRuleset) {
    return '';
  }

  // Compute the location of the local ruleset to use in looking for
  // the locally installed instance of the ruleset.
  const rulesetLocation = dirname(localRuleset);
  logger.debug('Custom ruleset file found in:', rulesetLocation);

  // Look for the locally installed ruleset package, which will have to
  // be there if the user is extending their ruleset from the IBM
  // ruleset. It follows Spectral's logic, seeking up from the location
  // of the ruleset and looking for a `node_modules/` folder that contains
  // the package name given in `extends`.
  const packagePath = await lookForRulesetPackage(rulesetLocation);

  if (packagePath) {
    logger.debug('Found IBM ruleset package file at:', packagePath);
    try {
      // Read the JSON file using `require`.
      const rulesetPackageFile = require(packagePath);

      // Return the value of the `version` field in the `package.json`.
      // Note: the "|| {}" just makes sure we don't get a type error from `hasOwn`.
      if (Object.hasOwn(rulesetPackageFile || {}, 'version')) {
        return rulesetPackageFile.version;
      }
    } catch (e) {
      logger.debug('Could not read the IBM ruleset package file:', e.message);
    }
  } else {
    logger.debug('IBM OpenAPI ruleset package not found');
  }

  // The IBM ruleset is not being used at all,
  // so we don't provide a version.
  return '';
}

/**
 * This function mimics the logic used by Spectral to find the
 * node module providing the ruleset package defined in the
 * `extends` field of a user ruleset. If they aren't extending
 * our package, thats okay - we either won't find it or we will
 * report the version that they would be using if they extend it.
 *
 * The logic starts in the directory where their ruleset config
 * file is found, then looks up in each directory until it finds
 * it or reaches the root of the filesystem. Returns the path to
 * the file it's looking for if found, undefined if it is not.
 *
 * @param string rulesetDir - the path to the users ruleset
 * @returns string|undefined - filepath if found, undefined if not
 */
async function lookForRulesetPackage(rulesetDir) {
  let pathToPackage;

  // This partial provides a "matcher" callback for `findUp`. It
  // will be called for each directory up a path and will check
  // for the IBM ruleset package in each one. If it finds it, it
  // will save the path and return the directory string (which
  // will stop the search) and if not, it will return `undefined`,
  // which continues the search.
  async function matchIBMRulesetPackage(directory) {
    const expectedPath = join(
      directory,
      'node_modules',
      '@ibm-cloud',
      'openapi-ruleset',
      'package.json'
    );

    const ibmRulesetFound = await findUp.exists(expectedPath);

    // The way to break the search is to return the directory
    // currently being searched, but we want to save the path
    // to the actual file as well.
    if (ibmRulesetFound) {
      pathToPackage = expectedPath;
      return directory;
    }

    return;
  }

  // Run `findUp` to look for the package file.
  const opts = { type: 'directory', cwd: rulesetDir };
  await findUp(matchIBMRulesetPackage, opts);
  return pathToPackage;
}
