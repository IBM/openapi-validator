/**
 * Copyright 2026 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const printResults = require('../../../src/cli-validator/utils/print-results');

const identity = s => s;
const chalk = {
  red: identity,
  yellow: identity,
  green: identity,
  grey: identity,
  cyan: identity,
  underline: { cyan: identity },
};

function buildResults(docLink) {
  const emptySummary = { total: 0, entries: [] };
  return {
    error: {
      results: [
        {
          message: 'Some message',
          rule: 'some-rule',
          path: ['paths', '/foo'],
          docLink,
          line: 10,
        },
      ],
      summary: {
        total: 1,
        entries: [{ count: 1, percentage: 100, generalizedMessage: 'Some' }],
      },
    },
    warning: { results: [], summary: emptySummary },
    info: { results: [], summary: emptySummary },
    hint: { results: [], summary: emptySummary },
  };
}

describe('print-results tests', function () {
  let logSpy;

  beforeEach(function () {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(function () {
    logSpy.mockRestore();
  });

  function printedLines(docLink) {
    printResults({ chalk, config: {} }, buildResults(docLink));
    return logSpy.mock.calls.map(call => call[0]);
  }

  it('should print the DocLink line when a docLink is present', function () {
    const lines = printedLines('https://example.com/docs');
    expect(lines).toContain('  DocLink :   https://example.com/docs');
  });

  it.each([
    ['empty string', ''],
    ['null', null],
    ['undefined', undefined],
  ])(
    'should not print a DocLink line when docLink is %s',
    function (_label, docLink) {
      const lines = printedLines(docLink);
      expect(lines.some(l => String(l).includes('DocLink'))).toBe(false);
      expect(lines.some(l => String(l).includes('null'))).toBe(false);
      expect(lines.some(l => String(l).includes('undefined'))).toBe(false);
      // surrounding fields are still printed
      expect(lines).toContain('  Rule    :   some-rule');
      expect(lines).toContain('  Line    :   10');
    }
  );
});
