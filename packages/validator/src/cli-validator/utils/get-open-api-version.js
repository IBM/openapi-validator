/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

function getVersion(spec) {
  // Let's prefer "openapi 3.x" if no swagger field is found.
  return spec.swagger ? '2' : '3';
}

module.exports = getVersion;
