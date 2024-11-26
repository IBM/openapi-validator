/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { categorizedScores } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('categorizedScores table tests', function () {
  it('should produce a table with categorized scores from the results', function () {
    const tableRows = categorizedScores(validatorResults).split('\n');

    expect(tableRows).toHaveLength(7);
    expect(tableRows[0]).toBe('| Category | Impact Score |');
    expect(tableRows[1]).toBe('| --- | --- |');
    expect(tableRows[2]).toBe('| usability | 94 / 100 |');
    expect(tableRows[3]).toBe('| security | 96 / 100 |');
    expect(tableRows[4]).toBe('| robustness | 97 / 100 |');
    expect(tableRows[5]).toBe('| evolution | 98 / 100 |');
    expect(tableRows[6]).toBe('| **overall** | **96 / 100** |');
  });
});
