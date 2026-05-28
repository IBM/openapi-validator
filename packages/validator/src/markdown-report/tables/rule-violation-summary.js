/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import MarkdownTable from '../markdown-table.js';

export function errorSummary({ error }) {
  return getTable(error);
}

export function warningSummary({ warning }) {
  return getTable(warning);
}

function getTable({ summary }) {
  const table = new MarkdownTable('Count', 'Percentage', 'Generalized Message');

  summary.entries.forEach(({ count, percentage, generalizedMessage }) => {
    table.addRow(count, `${percentage}%`, generalizedMessage);
  });

  return table.render();
}
