/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { ruleViolationDetails } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('ruleViolationDetails table tests', function () {
  it('should produce a table with all rule violations from the results', function () {
    const tableRows = ruleViolationDetails(validatorResults).split('\n');

    expect(tableRows).toHaveLength(5);
    expect(tableRows[0]).toBe('| Rule | Message | Path | Line | Severity |');
    expect(tableRows[1]).toBe('| --- | --- | --- | --- | --- |');
    expect(tableRows[2]).toBe(
      '| ibm-no-consecutive-path-parameter-segments | Path contains two or more consecutive path parameter references: /pets/{pet_id}/{id} | paths./pets/{pet_id}/{id} | 84 | error |'
    );
    expect(tableRows[3]).toBe(
      "| ibm-integer-attributes | Integer schemas should define property 'minimum' | components.schemas.Pet.properties.id | 133 | error |"
    );
    expect(tableRows[4]).toBe(
      "| ibm-anchored-patterns | A regular expression used in a 'pattern' attribute should be anchored with ^ and $ | components.schemas.Error.properties.message.pattern | 233 | warning |"
    );
  });
});
