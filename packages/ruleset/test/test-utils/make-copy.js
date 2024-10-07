/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = obj => {
  return JSON.parse(JSON.stringify(obj));
};
