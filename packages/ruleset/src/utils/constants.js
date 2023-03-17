/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Set of fields within a "path item" where we'd expect to find operations.
const operationMethods = [
  'get',
  'head',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'trace',
];

module.exports = operationMethods;
