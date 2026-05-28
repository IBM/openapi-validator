/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import MarkdownTable from '../markdown-table.js';

export default function getTable({ qualityScore }) {
  const { categorizedSummary } = qualityScore;
  const table = new MarkdownTable('Category', 'Quality Score');

  for (const [category, score] of Object.entries(categorizedSummary)) {
    // Bold the "overall" score.
    if (category === 'overall') {
      table.addRow(`**${category}**`, `**${score} / 100**`);
    } else {
      table.addRow(category, `${score} / 100`);
    }
  }

  return table.render();
}
