/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { ruleViolationDetails } = require('../../../src/markdown-report/tables');
const validatorResults = require('../../test-utils/mock-json-output.json');

describe('ruleViolationDetails table tests', function () {
  it('should produce grouped sections for errors and warnings', function () {
    const output = ruleViolationDetails(validatorResults);
    const lines = output.split('\n');

    // Errors heading
    expect(lines[0]).toBe('### Errors');
    expect(lines[1]).toBe('');

    // 3-col table
    expect(lines[2]).toBe(
      '### [ibm-no-consecutive-path-parameter-segments](https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md#ibm-no-consecutive-path-parameter-segments)'
    );
    expect(lines[3]).toBe('');
    expect(lines[4]).toBe(
      '_Path contains two or more consecutive path parameter references_'
    );
    expect(lines[5]).toBe('');
    expect(lines[6]).toBe('| Line | Path | Detail |');
    expect(lines[7]).toBe('| --- | --- | --- |');
    expect(lines[8]).toBe(
      '| 84 | paths./pets/{pet_id}/{id} | /pets/{pet_id}/{id} |'
    );
    expect(lines[9]).toBe('');

    // 2-col table
    expect(lines[10]).toBe(
      '### [ibm-integer-attributes](https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md#ibm-integer-attributes)'
    );
    expect(lines[11]).toBe('');
    expect(lines[12]).toBe(
      "_Integer schemas should define property 'minimum'_"
    );
    expect(lines[13]).toBe('');
    expect(lines[14]).toBe('| Line | Path |');
    expect(lines[15]).toBe('| --- | --- |');
    expect(lines[16]).toBe('| 133 | components.schemas.Pet.properties.id |');
    expect(lines[17]).toBe('');

    // Warnings heading
    expect(lines[18]).toBe('### Warnings');
    expect(lines[19]).toBe('');

    // 2-col table
    expect(lines[20]).toBe(
      '### [ibm-anchored-patterns](https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md#ibm-anchored-patterns)'
    );
    expect(lines[21]).toBe('');
    expect(lines[22]).toBe(
      "_A regular expression used in a 'pattern' attribute should be anchored with ^ and $_"
    );
    expect(lines[23]).toBe('');
    expect(lines[24]).toBe('| Line | Path |');
    expect(lines[25]).toBe('| --- | --- |');
    expect(lines[26]).toBe(
      '| 233 | components.schemas.Error.properties.message.pattern |'
    );

    expect(lines).toHaveLength(27);
  });

  it('should return an empty string when there are no results', function () {
    const empty = {
      error: { results: [] },
      warning: { results: [] },
    };
    expect(ruleViolationDetails(empty)).toBe('');
  });

  it('should only render the Errors section when there are no warnings', function () {
    const errorsOnly = {
      error: { results: validatorResults.error.results },
      warning: { results: [] },
    };
    const output = ruleViolationDetails(errorsOnly);
    expect(output).toContain('### Errors');
    expect(output).not.toContain('### Warnings');
  });

  it('should only render the Warnings section when there are no errors', function () {
    const warningsOnly = {
      error: { results: [] },
      warning: { results: validatorResults.warning.results },
    };
    const output = ruleViolationDetails(warningsOnly);
    expect(output).not.toContain('### Errors');
    expect(output).toContain('### Warnings');
  });

  it('should deduplicate violations with the same line and path', function () {
    const duplicate = {
      error: {
        results: [
          {
            message: 'Some error message',
            path: ['paths', '/foo'],
            rule: 'some-rule',
            docLink: 'https://example.com',
            line: 10,
          },
          {
            message: 'Some error message',
            path: ['paths', '/foo'],
            rule: 'some-rule',
            docLink: 'https://example.com',
            line: 10,
          },
        ],
      },
      warning: { results: [] },
    };
    const output = ruleViolationDetails(duplicate);
    const dataRows = output.split('\n').filter(l => l.startsWith('| 10 |'));
    expect(dataRows).toHaveLength(1);
  });

  it('should use a 3-column table when at least one violation has a detail', function () {
    const withDetail = {
      error: {
        results: [
          {
            message: 'Base message: detail value',
            path: ['paths', '/foo'],
            rule: 'rule-with-detail',
            docLink: 'https://example.com',
            line: 5,
          },
        ],
      },
      warning: { results: [] },
    };
    const output = ruleViolationDetails(withDetail);
    expect(output).toContain('| Line | Path | Detail |');
    expect(output).toContain('| 5 | paths./foo | detail value |');
  });
});
