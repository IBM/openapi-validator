/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function errorSummary({ error }) {
  return getTable(error);
}

function warningSummary({ warning }) {
  return getTable(warning);
}

function getTable({ summary }) {
  const table = new MarkdownTable('Count', 'Percentage', 'Generalized Message');

  summary.entries.forEach(({ count, percentage, generalizedMessage }) => {
    table.addRow(count, `${percentage}%`, generalizedMessage);
  });

  return table.render();
}

module.exports = {
  errorSummary,
  warningSummary,
};
