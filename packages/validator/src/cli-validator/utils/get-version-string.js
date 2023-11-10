/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const packageConfig = require('../../../package.json');

module.exports = function () {
  return `validator: ${packageConfig.version}`;
};
