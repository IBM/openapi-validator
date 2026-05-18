/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ qualityScore, error, warning }) {
  const table = new MarkdownTable(
    'Quality Score',
    'Error Count',
    'Warning Count'
  );

  table.addRow(
    `${qualityScore.categorizedSummary.overall} / 100`,
    error.summary.total,
    warning.summary.total
  );

  return table.render();
}

module.exports = getTable;
