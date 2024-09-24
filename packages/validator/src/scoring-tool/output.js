/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { Table } = require('console-table-printer');
const { getCategories } = require('./categories');

// Print out a table summarizing the max score for each category.
// category | max score
function printCategorizedScoresTable({ categorizedSummary }) {
  const table = new Table();

  table.addRows(
    Object.entries(categorizedSummary).map(([name, score]) => {
      // Edit the overall name in the table for clarity.
      if (name === 'overall') {
        name += ' (mean)';
      }

      return {
        category: name,
        // Make it clear that each max score is out of 100.
        'max score': `${score} /100`,
      };
    })
  );

  table.printTable();
}

// Print out a table with all of the rule-based data used to compute the score.
// rule │ count │ func │ usability impact │ security impact │ robustness impact │ evolution impact │ total
function printScoringDataTable({ scoringData }) {
  const table = new Table();

  table.addRows(
    scoringData.map(sd => {
      const { rule, count, func } = sd;
      const row = {
        rule,
        count,
        func,
      };

      getCategories().forEach(c => {
        row[`${c} impact`] = sd.demerits[c];
      });

      row['rule total'] = sd.demerits.total;

      return row;
    })
  );

  table.printTable();
}

module.exports = {
  printCategorizedScoresTable,
  printScoringDataTable,
};
