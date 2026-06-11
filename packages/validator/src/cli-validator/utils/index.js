/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

export default {
  checkRulesetVersion: require('./check-ruleset-version'),
  createCLIOptions: require('./cli-options'),
  getCopyrightString: require('./get-copyright-string'),
  getDefaultRulesetVersion: require('./get-default-ruleset-version'),
  getLocalRulesetVersion: require('./get-local-ruleset-version'),
  getVersionString: require('./get-version-string'),
  preprocessFile: require('./preprocess-file').default,
  printJson: require('./print-json').default,
  printResults: require('./print-results').default,
  printVersions: require('./print-versions').default,
  readYaml: require('./read-yaml').default,
  validateSchema: require('./validate-schema').default,
  ...require('./configuration-manager'),
  ...require('./file-extension-validator'),
};
