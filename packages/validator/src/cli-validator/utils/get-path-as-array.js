/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = function(path) {
  return Array.isArray(path) ? path : path.split('.');
};
