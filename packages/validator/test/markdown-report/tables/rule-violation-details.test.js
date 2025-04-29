/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { ruleViolationDetails } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('ruleViolationDetails table tests', function () {
  it('should produce a table with all rule violations from the results', function () {
    // Filter out empty lines, no need to check those.
    const tableRows = ruleViolationDetails(validatorResults)
      .split('\n')
      .filter(row => !!row);

    expect(tableRows).toHaveLength(15);

    expect(tableRows[0]).toBe(
      '### 🔴 ibm-no-consecutive-path-parameter-segments'
    );
    expect(tableRows[1]).toBe(
      '_Path contains two or more consecutive path parameter references_'
    );
    expect(tableRows[2]).toBe('| Line | Path | Details |');
    expect(tableRows[3]).toBe('| --- | --- | --- |');
    expect(tableRows[4]).toBe(
      '| 84 | paths./pets/{pet_id}/{id} | /pets/{pet_id}/{id} |'
    );
    expect(tableRows[5]).toBe('### 🔴 ibm-integer-attributes');
    expect(tableRows[6]).toBe(
      "_Integer schemas should define property 'minimum'_"
    );
    expect(tableRows[7]).toBe('| Line | Path |');
    expect(tableRows[8]).toBe('| --- | --- |');
    expect(tableRows[9]).toBe('| 133 | components.schemas.Pet.properties.id |');
    expect(tableRows[10]).toBe('### 🟠 ibm-anchored-patterns');
    expect(tableRows[11]).toBe(
      "_A regular expression used in a 'pattern' attribute should be anchored with ^ and $_"
    );
    expect(tableRows[12]).toBe('| Line | Path |');
    expect(tableRows[13]).toBe('| --- | --- |');
    expect(tableRows[14]).toBe(
      '| 233 | components.schemas.Error.properties.message.pattern |'
    );
  });
});
