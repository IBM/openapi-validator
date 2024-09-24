/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { extractValuesFromTable } = require('../test-utils');
const {
  printCategorizedScoresTable,
  printScoringDataTable,
} = require('../../src/scoring-tool/output');

describe('scoring-tool output tests', function () {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should printCategorizedScoresTable - print score summary table', function () {
    printCategorizedScoresTable(getMockScores());
    const tableContents = extractValuesFromTable(consoleSpy.mock.calls[0][0]);

    expect(tableContents).toHaveLength(9);

    // Ignore rows 0 and 2. They are table borders. Row 1 should
    // be the table headers. Rows 3-n will hold the values.
    expect(tableContents.at(1)).toEqual(['category', 'max score']);

    expect(tableContents.at(3)).toEqual(['usability', '61 /100']);

    expect(tableContents.at(4)).toEqual(['security', '24 /100']);

    expect(tableContents.at(5)).toEqual(['robustness', '42 /100']);

    expect(tableContents.at(6)).toEqual(['evolution', '27 /100']);

    expect(tableContents.at(7)).toEqual(['overall (mean)', '39 /100']);
  });

  it('should printScoringDataTable - print the scoring data table', function () {
    printScoringDataTable(getMockScores());
    const tableContents = extractValuesFromTable(consoleSpy.mock.calls[0][0]);

    expect(tableContents).toHaveLength(7);

    // Ignore rows 0 and 2. They are table borders. Row 1 should
    // be the table headers. Rows 3-n will hold the values.
    expect(tableContents.at(1)).toEqual([
      'rule',
      'count',
      'func',
      'usability impact',
      'security impact',
      'robustness impact',
      'evolution impact',
      'rule total',
    ]);

    expect(tableContents.at(3)).toEqual([
      'ibm-response-status-codes',
      '2',
      '2×1÷operations',
      '0.67',
      '',
      '1.33',
      '2.00',
      '4.00',
    ]);

    expect(tableContents.at(4)).toEqual([
      'ibm-string-attributes',
      '12',
      '12×2÷string-schemas',
      '4.00',
      '20.00',
      '8.00',
      '12.00',
      '44.00',
    ]);

    expect(tableContents.at(5)).toEqual([
      'ibm-property-description',
      '2',
      '2×25÷schemas',
      '2.94',
      '',
      '5.88',
      '',
      '8.82',
    ]);
  });
});

function getMockScores() {
  return {
    categorizedSummary: {
      usability: '61',
      security: '24',
      robustness: '42',
      evolution: '27',
      overall: '39',
    },
    scoringData: [
      {
        rule: 'ibm-response-status-codes',
        count: 2,
        func: '2×1÷operations',
        demerits: {
          usability: '0.67',
          robustness: '1.33',
          evolution: '2.00',
          total: '4.00',
        },
      },
      {
        rule: 'ibm-string-attributes',
        count: 12,
        func: '12×2÷string-schemas',
        demerits: {
          usability: '4.00',
          security: '20.00',
          robustness: '8.00',
          evolution: '12.00',
          total: '44.00',
        },
      },
      {
        rule: 'ibm-property-description',
        count: 2,
        func: '2×25÷schemas',
        demerits: { usability: '2.94', robustness: '5.88', total: '8.82' },
      },
    ],
  };
}
