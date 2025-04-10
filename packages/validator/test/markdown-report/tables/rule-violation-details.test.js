/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { ruleViolationDetails } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('ruleViolationDetails table tests', function () {
  it('should produce a table with all rule violations from the results', function () {
    const tableRows = ruleViolationDetails(validatorResults).split('\n');

    expect(tableRows).toHaveLength(20);

    // First rule.
    expect(tableRows[0]).toBe(
      '| Rule | ibm-no-consecutive-path-parameter-segments |'
    );
    expect(tableRows[1]).toBe('| --- | --- |');
    expect(tableRows[2]).toBe(
      '| Message | Path contains two or more consecutive path parameter references: /pets/{pet_id}/{id} |'
    );
    expect(tableRows[3]).toBe('| Path | paths./pets/{pet_id}/{id} |');
    expect(tableRows[4]).toBe('| Line | 84 |');
    expect(tableRows[5]).toBe('| Severity | error |');
    expect(tableRows[6]).toBe('');

    // Second rule.
    expect(tableRows[7]).toBe('| Rule | ibm-integer-attributes |');
    expect(tableRows[8]).toBe('| --- | --- |');
    expect(tableRows[9]).toBe(
      `| Message | Integer schemas should define property 'minimum' |`
    );
    expect(tableRows[10]).toBe(
      '| Path | components.schemas.Pet.properties.id |'
    );
    expect(tableRows[11]).toBe('| Line | 133 |');
    expect(tableRows[12]).toBe('| Severity | error |');
    expect(tableRows[13]).toBe('');

    // Third rule.
    expect(tableRows[14]).toBe('| Rule | ibm-anchored-patterns |');
    expect(tableRows[15]).toBe('| --- | --- |');
    expect(tableRows[16]).toBe(
      `| Message | A regular expression used in a 'pattern' attribute should be anchored with ^ and $ |`
    );
    expect(tableRows[17]).toBe(
      '| Path | components.schemas.Error.properties.message.pattern |'
    );
    expect(tableRows[18]).toBe('| Line | 233 |');
    expect(tableRows[19]).toBe('| Severity | warning |');
  });
});
