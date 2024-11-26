/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ impactScore, error, warning }) {
  const table = new MarkdownTable(
    'Impact Score',
    'Error Count',
    'Warning Count'
  );

  table.addRow(
    `${impactScore.categorizedSummary.overall} / 100`,
    error.summary.total,
    warning.summary.total
  );

  return table.render();
}

module.exports = getTable;
