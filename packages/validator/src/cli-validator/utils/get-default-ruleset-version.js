/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { dependencies } from '../../../package.json';

export default getDefaultRulesetVersion;

/**
 * Looks at the validator tool's declared dependencies and
 * returns the semantic version of the IBM Cloud OpenAPI
 * Ruleset package that ships by default with the current
 * version of the validator tool.
 *
 * @returns string - the default ruleset version
 */
function getDefaultRulesetVersion() {
  return dependencies['@ibm-cloud/openapi-ruleset'];
}
