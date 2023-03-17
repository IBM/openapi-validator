/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const packageConfig = require('../../../package.json');

module.exports = function () {
  const validator = packageConfig.version;
  const ruleset = packageConfig.dependencies['@ibm-cloud/openapi-ruleset'];

  return `validator: ${validator}; ruleset: ${ruleset}`;
};
