/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import packageConfig from '../../../package.json' assert { type: 'json' };

/**
 * Looks at the validator tool's declared dependencies and
 * returns the semantic version of the IBM Cloud OpenAPI
 * Ruleset package that ships by default with the current
 * version of the validator tool.
 *
 * @returns string - the default ruleset version
 */
function getDefaultRulesetVersion() {
  return packageConfig.dependencies['@ibm-cloud/openapi-ruleset'];
}

export default getDefaultRulesetVersion;
