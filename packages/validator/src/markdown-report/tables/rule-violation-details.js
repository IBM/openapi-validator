/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ error, warning }) {
  const table = new MarkdownTable(
    'Rule',
    'Message',
    'Path',
    'docLink',
    'Line',
    'Severity'
  );

  error.results.forEach(({ message, path, rule, line, docLink }) => {
    table.addRow(rule, message, path.join('.'), docLink, line, 'error');
  });

  warning.results.forEach(({ message, path, rule, line, docLink }) => {
    table.addRow(rule, message, path.join('.'), docLink, line, 'warning');
  });

  return table.render();
}

module.exports = getTable;
