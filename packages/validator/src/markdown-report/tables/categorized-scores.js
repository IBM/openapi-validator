/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ impactScore }) {
  const { categorizedSummary } = impactScore;
  const table = new MarkdownTable('Category', 'Impact Score');

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

module.exports = getTable;
