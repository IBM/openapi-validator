/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import MarkdownTable from '../markdown-table.js';

export default function getTable({ qualityScore, error, warning }) {
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
