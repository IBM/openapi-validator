/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { existsSync, unlinkSync } = require('fs');

const {
  extractValuesFromTable,
  getCapturedText,
  getCapturedTextWithColor,
  stripAnsi,
  testValidator,
} = require('../../test-utils');

const {
  getCopyrightString,
  readYaml,
  validateSchema,
} = require('../../../src/cli-validator/utils');

describe('cli tool - test option handling', function () {
  let consoleSpy;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;
  const copyrightString = getCopyrightString();

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    console.warn = console.log;
    console.error = console.log;
    console.info = console.log;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    console.warn = originalWarn;
    console.error = originalError;
    console.info = originalInfo;
  });

  it('should colorize output by default @skip-ci', async function () {
    await testValidator([
      './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
    ]);
    const capturedText = getCapturedTextWithColor(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    capturedText.forEach(function (line) {
      if (line && line !== copyrightString) {
        expect(line).not.toEqual(stripAnsi(line));
      }
    });
  });

  it.each(['-n', '--no-colors'])(
    'should not colorize output when -n/--no-colors option is specified',
    async function (option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);

      capturedText.forEach(function (line) {
        expect(line).toEqual(stripAnsi(line));
      });
    }
  );

  it.each(['-e', '--errors-only'])(
    'should print only errors when the -e/--errors-only option is specified',
    async function (option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);

      capturedText.forEach(function (line) {
        expect(line.includes('warnings')).toEqual(false);
      });
    }
  );

  it.each(['-s', '--summary-only'])(
    'should print only the summary when -s/--summary-only option is specified',
    async function (option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // This can be uncommented to display the output when adjustments to
      // the expect statements below are needed.
      // let textOutput = '';
      // capturedText.forEach((elem, index) => {
      //   textOutput += `[${index}]: ${elem}\n`;
      // });
      // originalError(textOutput);

      let summaryReported = false;

      capturedText.forEach(function (line) {
        if (line.includes('Summary:')) {
          summaryReported = true;
        }
      });

      // .match(/\S+/g) returns an array of all non-whitespace strings
      //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
      expect(summaryReported).toEqual(true);

      const sumSection = capturedText.findIndex(x => x.includes('Summary:'));
      expect(sumSection).toBe(3);

      // totals
      expect(capturedText[sumSection + 2].match(/\S+/g)[5]).toEqual('4');
      expect(capturedText[sumSection + 3].match(/\S+/g)[5]).toEqual('29');

      // errors
      const errorSection = 8;
      expect(capturedText[errorSection + 1].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[errorSection + 1].match(/\S+/g)[1]).toEqual('(25%)');

      expect(capturedText[errorSection + 2].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[errorSection + 2].match(/\S+/g)[1]).toEqual('(50%)');

      // warnings
      const warningSection = 13;
      expect(capturedText[warningSection + 1].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[warningSection + 1].match(/\S+/g)[1]).toEqual('(7%)');

      expect(capturedText[warningSection + 2].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[warningSection + 2].match(/\S+/g)[1]).toEqual('(7%)');

      expect(capturedText[warningSection + 3].match(/\S+/g)[0]).toEqual('5');
      expect(capturedText[warningSection + 3].match(/\S+/g)[1]).toEqual(
        '(17%)'
      );

      expect(capturedText[warningSection + 4].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[warningSection + 4].match(/\S+/g)[1]).toEqual('(3%)');

      expect(capturedText[warningSection + 5].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[warningSection + 5].match(/\S+/g)[1]).toEqual('(7%)');

      expect(capturedText[warningSection + 6].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[warningSection + 6].match(/\S+/g)[1]).toEqual('(3%)');

      expect(capturedText[warningSection + 7].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[warningSection + 7].match(/\S+/g)[1]).toEqual('(3%)');

      expect(capturedText[warningSection + 8].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[warningSection + 8].match(/\S+/g)[1]).toEqual('(7%)');

      expect(capturedText[warningSection + 9].match(/\S+/g)[0]).toEqual('4');
      expect(capturedText[warningSection + 9].match(/\S+/g)[1]).toEqual(
        '(14%)'
      );

      expect(capturedText[warningSection + 10].match(/\S+/g)[0]).toEqual('4');
      expect(capturedText[warningSection + 10].match(/\S+/g)[1]).toEqual(
        '(14%)'
      );

      expect(capturedText[warningSection + 11].match(/\S+/g)[0]).toEqual('4');
      expect(capturedText[warningSection + 11].match(/\S+/g)[1]).toEqual(
        '(14%)'
      );

      expect(capturedText[warningSection + 12].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[warningSection + 12].match(/\S+/g)[1]).toEqual(
        '(3%)'
      );
    }
  );

  it.each(['-j', '--json'])(
    'should print json output when -j/--json option is specified',
    async function (option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${capturedText}`);

      // capturedText should be JSON object. convert to json and check fields
      const outputObject = JSON.parse(capturedText);

      // Representative sample of the rule violations.
      expect(outputObject.error.results[0]['line']).toEqual(52);
      expect(outputObject.error.results[0]['message']).toEqual(
        'Every operation must have unique "operationId".'
      );

      // Representative sample of the impact score information.
      expect(
        outputObject.impactScore.categorizedSummary.usability
      ).toBeTruthy();
      expect(outputObject.impactScore.categorizedSummary.security).toBeTruthy();
      expect(
        outputObject.impactScore.categorizedSummary.robustness
      ).toBeTruthy();
      expect(
        outputObject.impactScore.categorizedSummary.evolution
      ).toBeTruthy();
      expect(outputObject.impactScore.categorizedSummary.overall).toBeTruthy();
      expect(outputObject.impactScore.scoringData.length).toBeGreaterThan(0);

      // json output should comply with written schema
      const outputSchemaPath =
        __dirname + '/../../../src/schemas/results-object.yaml';
      const outputSchema = await readYaml(outputSchemaPath);
      const results = validateSchema(outputObject, outputSchema);
      expect(results).toHaveLength(0);
    }
  );

  it('should print only errors as json output when -j and -e options are specified together', async function () {
    await testValidator([
      '-j',
      '-e',
      './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    ['warning', 'info', 'hint'].forEach(severity => {
      expect(outputObject[severity].results.length).toEqual(0);
      expect(outputObject[severity].summary.total).toEqual(0);
    });
  });

  it('should not include results in json output when -j and -s options are specified together', async function () {
    await testValidator([
      '-j',
      '-s',
      './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    ['error', 'warning', 'info', 'hint'].forEach(severity => {
      expect(outputObject[severity].results.length).toEqual(0);
    });

    expect(outputObject.error.summary.total).toBeGreaterThan(0);
    expect(outputObject.warning.summary.total).toBeGreaterThan(0);
  });

  it.each(['-q', '--impact-score'])(
    'should print two scoring tables when the -q/--impact-score option is specified',
    async function (option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);

      // Most of the data is more fragile, but this proves we printed
      // the first table and the correct values in the first column.
      const firstTable = extractValuesFromTable(capturedText.at(-3));
      const firstColumn = 0;
      expect(firstTable.at(1)).toEqual(['category', 'max score']);
      expect(firstTable.at(3).at(firstColumn)).toBe('usability');
      expect(firstTable.at(4).at(firstColumn)).toBe('security');
      expect(firstTable.at(5).at(firstColumn)).toBe('robustness');
      expect(firstTable.at(6).at(firstColumn)).toBe('evolution');
      expect(firstTable.at(7).at(firstColumn)).toBe('overall (mean)');

      const secondTable = extractValuesFromTable(capturedText.at(-2));
      // The rest of the data is more fragile, but this proves we printed the second table.
      expect(secondTable.at(1)).toEqual([
        'rule',
        'count',
        'func',
        'usability impact',
        'security impact',
        'robustness impact',
        'evolution impact',
        'rule total',
      ]);
    }
  );

  it('should only include errors in scoring tables when -q and -e options are specified together', async function () {
    await testValidator([
      '-q',
      '-e',
      './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const secondTable = extractValuesFromTable(capturedText.at(-2));
    const firstColumn = 0;

    expect(secondTable.length).toBe(7);
    expect(secondTable.at(1).at(firstColumn)).toBe('rule');
    expect(secondTable.at(3).at(firstColumn)).toBe(
      'operation-operationId-unique'
    );
    expect(secondTable.at(4).at(firstColumn)).toBe('ibm-no-array-responses');
    expect(secondTable.at(5).at(firstColumn)).toBe('no-$ref-siblings');
  });

  it('should only include summary scoring table when -q and -s options are specified together', async function () {
    await testValidator([
      '-q',
      '-s',
      './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const firstAndOnlyTable = extractValuesFromTable(capturedText.at(-2));
    const firstColumn = 0;
    expect(firstAndOnlyTable.at(1)).toEqual(['category', 'max score']);
    expect(firstAndOnlyTable.at(3).at(firstColumn)).toBe('usability');
    expect(firstAndOnlyTable.at(4).at(firstColumn)).toBe('security');
    expect(firstAndOnlyTable.at(5).at(firstColumn)).toBe('robustness');
    expect(firstAndOnlyTable.at(6).at(firstColumn)).toBe('evolution');
    expect(firstAndOnlyTable.at(7).at(firstColumn)).toBe('overall (mean)');
  });

  it('should print out the version strings with the --version option', async function () {
    await testValidator(['--version']);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(capturedText).toHaveLength(1);
    expect(capturedText[0]).toMatch(/validator:.*ruleset:.*(default)/);
  });

  describe('test unknown option handling', function () {
    it('should return an error and help text when there is an unknown option', async function () {
      let caughtException = false;
      let exception;
      try {
        await testValidator(['--unknown-option']);
      } catch (err) {
        // originalError(`caught exception: ${err}`);
        caughtException = true;
        exception = err;
      }
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);

      expect(caughtException).toBe(true);
      expect(exception).toBe(2);

      expect(capturedText[0]).toMatch(
        /error: unknown option '--unknown-option'/
      );
      expect(capturedText[2]).toMatch(
        /IBM OpenAPI Validator.*Copyright IBM Corporation/
      );
      expect(capturedText[3]).toMatch(/Usage: lint-openapi/);
    });
  });

  describe('test markdown report option handling', function () {
    // Use this API for all of the tests so the expected name
    // of the created file stays consistent.
    const fileToTest = './test/cli-validator/mock-files/oas3/clean.yml';
    const expectedFile = 'clean-validator-report.md';

    beforeEach(function () {
      // Make sure there is no markdown report file before the test is executed.
      expect(existsSync(expectedFile)).toBe(false);
    });

    afterEach(function () {
      // Delete the markdown report we've just created.
      unlinkSync(expectedFile);
    });

    it.each(['-m', '--markdown-report'])(
      'should write a markdown file when the -m/--markdown-report option is specified',
      async function (option) {
        await testValidator([option, fileToTest]);
        const capturedText = getCapturedText(consoleSpy.mock.calls);
        expect(capturedText.at(-1)).toMatch(
          new RegExp(
            'Successfully wrote Markdown report to file: .*/openapi-validator/packages/validator/clean-validator-report.md'
          )
        );
        expect(existsSync(expectedFile)).toBe(true);
      }
    );

    it('should print file but not confirmation message when output is json', async function () {
      await testValidator(['-m', '-j', fileToTest]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      expect(existsSync(expectedFile)).toBe(true);
      expect(capturedText.join('')).not.toMatch(
        'Successfully wrote Markdown report to file'
      );
    });
  });
});
