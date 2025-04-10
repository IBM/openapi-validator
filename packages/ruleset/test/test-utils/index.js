/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const allSchemasDocument = require('./all-schemas-document');
const makeCopy = require('./make-copy');
const testRule = require('./test-rule');
const unitTestRule = require('./unit-test-rule');
const rootDocument = require('./root-document');
const severityCodes = require('./severity-codes');
const helperArtifacts = require('./helper-artifacts');

module.exports = {
  allSchemasDocument,
  makeCopy,
  rootDocument,
  testRule,
  unitTestRule,
  severityCodes,
  helperArtifacts,
};
