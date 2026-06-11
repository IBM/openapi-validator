/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import MarkdownTable from '../markdown-table';

function getTable({ error, warning }) {
  const table = new MarkdownTable(
    'Rule',
    'Message',
    'Path',
    'Line',
    'Severity'
  );

  error.results.forEach(({ message, path, rule, line }) => {
    table.addRow(rule, message, path.join('.'), line, 'error');
  });

  warning.results.forEach(({ message, path, rule, line }) => {
    table.addRow(rule, message, path.join('.'), line, 'warning');
  });

  return table.render();
}

export default getTable;
