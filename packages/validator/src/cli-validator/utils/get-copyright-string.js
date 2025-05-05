/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const getVersionString = require('./get-version-string');

module.exports = function () {
  return `IBM OpenAPI Validator (${getVersionString()}), @Copyright IBM Corporation 2017, ${new Date().getFullYear()}.`;
};
