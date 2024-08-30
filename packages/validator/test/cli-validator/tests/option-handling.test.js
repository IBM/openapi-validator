/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
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
      expect(capturedText[sumSection + 2].match(/\S+/g)[5]).toEqual('5');
      expect(capturedText[sumSection + 3].match(/\S+/g)[5]).toEqual('29');

      // errors
      const errorSection = 8;
      expect(capturedText[errorSection + 1].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[errorSection + 1].match(/\S+/g)[1]).toEqual('(20%)');

      expect(capturedText[errorSection + 2].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[errorSection + 2].match(/\S+/g)[1]).toEqual('(40%)');

      expect(capturedText[errorSection + 3].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[errorSection + 3].match(/\S+/g)[1]).toEqual('(20%)');

      expect(capturedText[errorSection + 4].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[errorSection + 4].match(/\S+/g)[1]).toEqual('(20%)');

      // warnings
      const warningSection = 14;
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

      // {"line": 59, "message": "Every operation must have unique "operationId".", "path": ["paths", "/pet", "put", "operationId"], "rule": "operation-operationId-unique"}
      expect(outputObject.error.results[0]['line']).toEqual(52);
      expect(outputObject.error.results[0]['message']).toEqual(
        'Every operation must have unique "operationId".'
      );

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
});
