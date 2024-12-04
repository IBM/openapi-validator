/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  errorSummary,
  warningSummary,
} = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('ruleViolationSummary table tests', function () {
  it('should produce a table with a summary of the error results', function () {
    const tableRows = errorSummary(validatorResults).split('\n');

    expect(tableRows).toHaveLength(4);
    expect(tableRows[0]).toBe('| Count | Percentage | Generalized Message |');
    expect(tableRows[1]).toBe('| --- | --- | --- |');
    expect(tableRows[2]).toBe(
      '| 1 | 50% | Path contains two or more consecutive path parameter references |'
    );
    expect(tableRows[3]).toBe(
      "| 1 | 50% | Integer schemas should define property 'minimum' |"
    );
  });

  it('should produce a table with a summary of the warning results', function () {
    const tableRows = warningSummary(validatorResults).split('\n');

    expect(tableRows).toHaveLength(3);
    expect(tableRows[0]).toBe('| Count | Percentage | Generalized Message |');
    expect(tableRows[1]).toBe('| --- | --- | --- |');
    expect(tableRows[2]).toBe(
      "| 1 | 100% | A regular expression used in a 'pattern' attribute should be anchored with ^ and $ |"
    );
  });
});
