/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { scoringData } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('scoringData table tests', function () {
  it('should produce a table with scoring information from the results', function () {
    const tableRows = scoringData(validatorResults).split('\n');

    expect(tableRows).toHaveLength(5);
    expect(tableRows[0]).toBe(
      '| Rule | Count | Func | Usability Impact | Security Impact | Robustness Impact | Evolution Impact | Rule Total |'
    );
    expect(tableRows[1]).toBe(
      '| --- | --- | --- | --- | --- | --- | --- | --- |'
    );
    expect(tableRows[2]).toBe(
      '| ibm-no-consecutive-path-parameter-segments | 1 | 1×10÷operations | 3.33 |  |  |  | 3.33 |'
    );
    expect(tableRows[3]).toBe(
      '| ibm-integer-attributes | 1 | 1×2÷integer-schemas | 0.5 | 2.5 | 1 | 1.5 | 5.5 |'
    );
    expect(tableRows[4]).toBe(
      '| ibm-anchored-patterns | 1 | 1×1÷operations |  |  | 0.67 |  | 0.67 |'
    );
  });
});
