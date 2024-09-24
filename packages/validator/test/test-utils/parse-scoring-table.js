/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

function extractValuesFromTable(table) {
  return table
    .replaceAll('\x1B[37m', '')
    .replaceAll('\x1B[0m', '')
    .replaceAll('\x1B[01m', '')
    .split('\n')
    .map(row =>
      row
        .split('│')
        .map(s => s.trim())
        .slice(1, -1)
    );
}

module.exports = {
  extractValuesFromTable,
};
