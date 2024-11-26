/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { primary } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('primary table tests', function () {
  it('should produce a table with the primary data from the results', function () {
    const tableRows = primary(validatorResults).split('\n');

    expect(tableRows).toHaveLength(3);
    expect(tableRows[0]).toBe('| Impact Score | Error Count | Warning Count |');
    expect(tableRows[1]).toBe('| --- | --- | --- |');
    expect(tableRows[2]).toBe('| 96 / 100 | 2 | 1 |');
  });
});
