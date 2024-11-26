/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { writeFileSync } = require('fs');
const path = require('path');

function writeReportToFile({ currentFilename }, report) {
  // For now, only a default filename is supported, which
  // is based on the name of the API definition file.
  const { name } = path.parse(currentFilename);
  const reportFilename = `${name}-validator-report.md`;

  // Write the output to a file. It will overwrite an existing file.
  writeFileSync(reportFilename, report);

  // Return the filename as a confirmation of the success and for
  // later use in the logs shown to the user.
  return path.resolve(process.cwd(), reportFilename);
}

module.exports = writeReportToFile;
