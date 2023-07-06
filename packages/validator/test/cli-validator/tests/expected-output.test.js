/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCapturedText, testValidator } = require('../../test-utils');

describe('Expected output tests', function () {
  let consoleSpy;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

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

  describe('OpenAPI 3', function () {
    it.each(['oas3', 'oas31'])(
      'should not produce any errors or warnings from a clean file',
      async function (oasVersion) {
        const filename = `./test/cli-validator/mock-files/${oasVersion}/clean.yml`;
        const exitCode = await testValidator([filename]);
        expect(exitCode).toEqual(0);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const allOutput = capturedText.join('');

        expect(allOutput).toContain(`${filename} passed the validator`);
      }
    );

    it.each(['oas3', 'oas31'])(
      'should produce errors and warnings from err-and-warn.yaml',
      async function (oasVersion) {
        const filename = `./test/cli-validator/mock-files/${oasVersion}/err-and-warn.yaml`;
        const exitCode = await testValidator([filename]);
        const capturedText = getCapturedText(consoleSpy.mock.calls);
        // originalError('Captured text:\n', capturedText);
        expect(exitCode).toEqual(1);

        const whichProblems = [];
        capturedText.forEach(function (line) {
          if (line.includes('errors')) {
            whichProblems.push('errors');
          }
          if (line.includes('warnings')) {
            whichProblems.push('warnings');
          }
        });

        expect(whichProblems[0]).toEqual('errors');
        expect(whichProblems[1]).toEqual('warnings');
      }
    );

    it.each(['oas3', 'oas31'])(
      'should print the correct line numbers for each error/warning',
      async function (oasVersion) {
        const filename = `./test/cli-validator/mock-files/${oasVersion}/err-and-warn.yaml`;
        const exitCode = await testValidator([filename]);
        expect(exitCode).toEqual(1);

        const capturedText = getCapturedText(consoleSpy.mock.calls);

        // This can be uncommented to display the output when adjustments to
        // the expect statements below are needed.
        // let textOutput = '';
        // capturedText.forEach((elem, index) => {
        //   textOutput += `[${index}]: ${elem}\n`;
        // });
        // originalError(textOutput);

        // errors
        const errorStart = 3;
        expect(capturedText[errorStart + 5].match(/\S+/g)[2]).toEqual('52');
        expect(capturedText[errorStart + 10].match(/\S+/g)[2]).toEqual('96');
        expect(capturedText[errorStart + 15].match(/\S+/g)[2]).toEqual('103');

        // warnings
        const warningStart = 20;
        expect(capturedText[warningStart + 5].match(/\S+/g)[2]).toEqual('22');
        expect(capturedText[warningStart + 10].match(/\S+/g)[2]).toEqual('24');
        expect(capturedText[warningStart + 15].match(/\S+/g)[2]).toEqual('40');
        expect(capturedText[warningStart + 20].match(/\S+/g)[2]).toEqual('41');
        expect(capturedText[warningStart + 25].match(/\S+/g)[2]).toEqual('52');
        expect(capturedText[warningStart + 30].match(/\S+/g)[2]).toEqual('56');
        expect(capturedText[warningStart + 35].match(/\S+/g)[2]).toEqual('57');
        expect(capturedText[warningStart + 40].match(/\S+/g)[2]).toEqual('59');
        expect(capturedText[warningStart + 45].match(/\S+/g)[2]).toEqual('61');
        expect(capturedText[warningStart + 50].match(/\S+/g)[2]).toEqual('96');
        // Skip a few, then verify the last one.
        expect(capturedText[warningStart + 145].match(/\S+/g)[2]).toEqual(
          '213'
        );
      }
    );

    it('should catch problems in a multi-file spec from an outside directory', async function () {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/multi-file-spec/main.yaml',
      ]);
      expect(exitCode).toEqual(1);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');

      expect(allOutput).toContain('errors');
      expect(allOutput).toContain('Object must have required property "info"');
      expect(allOutput).toContain('warnings');
      expect(allOutput).toContain('Operation must have "operationId"');
      expect(allOutput).toContain(
        'Operation "description" must be present and non-empty string'
      );
    });

    it.each(['oas3', 'oas31'])(
      'should handle an array of file names',
      async function (oasVersion) {
        const args = [
          `./test/cli-validator/mock-files/${oasVersion}/err-and-warn.yaml`,
          'notAFile.json',
          `./test/cli-validator/mock-files/${oasVersion}/clean.yml`,
        ];
        const exitCode = await testValidator(args);
        expect(exitCode).toEqual(1);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const allOutput = capturedText.join('');

        expect(
          allOutput.includes('[WARN] Skipping non-existent file: notAFile.json')
        ).toEqual(true);

        expect(
          allOutput.includes(
            `Validation Results for ./test/cli-validator/mock-files/${oasVersion}/err-and-warn.yaml:`
          )
        ).toEqual(true);

        expect(
          allOutput.includes(
            `Validation Results for ./test/cli-validator/mock-files/${oasVersion}/clean.yml:`
          )
        ).toEqual(true);
      }
    );

    it('should not produce any errors or warnings from mock-files/oas3/clean-with-tabs.yml', async function () {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/clean-with-tabs.yml',
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      expect(capturedText.length).toEqual(4);
      expect(capturedText[3].trim()).toEqual(
        './test/cli-validator/mock-files/oas3/clean-with-tabs.yml passed the validator'
      );
    });

    it.each(['-j', '--json'])(
      'should include the associated rule with each error and warning in JSON output',
      async function (option) {
        const exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
        ]);
        expect(exitCode).toEqual(1);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const jsonOutput = JSON.parse(capturedText);

        const msgsByType = Object.assign(
          {},
          jsonOutput.errors,
          jsonOutput.warnings,
          jsonOutput.infos,
          jsonOutput.hints
        );
        const allMessages = Object.entries(msgsByType).reduce(
          (newObj, val) => newObj.concat(val[1]),
          []
        );

        allMessages.forEach(msg => expect(msg).toHaveProperty('rule'));
      }
    );

    it('should return exit code of 0 if there are only warnings', async function () {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/just-warn.yml',
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');
      expect(allOutput.includes('warnings')).toEqual(true);
    });

    it.each(['oas3', 'oas31'])(
      'should include the path to the component (if it exists) when in json mode',
      async function (oasVersion) {
        const exitCode = await testValidator([
          '-j',
          `./test/cli-validator/mock-files/${oasVersion}/component-path-example.yaml`,
        ]);
        expect(exitCode).toEqual(0);

        const capturedText = getCapturedText(consoleSpy.mock.calls);

        const jsonOutput = JSON.parse(capturedText);
        const warningToCheck = jsonOutput.warning.results[0];

        expect(warningToCheck.rule).toEqual('ibm-prefer-token-pagination');
        expect(warningToCheck.path.join('.')).toBe('paths./letters.get');
        expect(warningToCheck.line).toEqual(20);
      }
    );
  });
});
