/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import getReport from './report.js';
import writeReportToFile from './write-file.js';

function printMarkdownReport(context, results) {
  const report = getReport(context, results);
  return writeReportToFile(context, report);
}

export default { printMarkdownReport };
