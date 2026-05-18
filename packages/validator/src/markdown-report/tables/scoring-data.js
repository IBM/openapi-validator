/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ qualityScore }) {
  const { scoringData } = qualityScore;
  const table = new MarkdownTable(
    'Rule',
    'Count',
    'Func',
    'Usability Quality',
    'Security Quality',
    'Robustness Quality',
    'Evolution Quality',
    'Rule Total'
  );

  scoringData.forEach(({ rule, count, func, demerits }) => {
    const { usability, security, robustness, evolution, total } = demerits;
    table.addRow(
      rule,
      count,
      func,
      usability,
      security,
      robustness,
      evolution,
      total
    );
  });

  return table.render();
}

module.exports = getTable;
