/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTables(violations) {
  let tableOutput = '';
  for (const severity of ['error', 'warning']) {
    for (const { message, path, rule, line } of violations[severity].results) {
      const table = new MarkdownTable('Rule', rule);
      table.addRow('Message', message);
      table.addRow('Path', path.join('.'));
      table.addRow('Line', line);
      table.addRow('Severity', severity);

      tableOutput += `${table.render()}\n\n`;
    }
  }

  // Remove the final newline characters from the string.
  return tableOutput.trim();
}

module.exports = getTables;
