/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');

function getTable({ impactScore }) {
  const { scoringData } = impactScore;
  const table = new MarkdownTable(
    'Rule',
    'Count',
    'Func',
    'Usability Impact',
    'Security Impact',
    'Robustness Impact',
    'Evolution Impact',
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
