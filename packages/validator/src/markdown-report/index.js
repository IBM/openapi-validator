/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const getReport = require('./report');
const writeReportToFile = require('./write-file');

function printMarkdownReport(context, results) {
  const report = getReport(context, results);
  return writeReportToFile(context, report);
}

module.exports = { printMarkdownReport };
