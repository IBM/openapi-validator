const { getCapturedText, testValidator } = require('../../test-utils');

const count = (array, regex) => {
  return array.reduce((a, v) => (v.match(regex) ? a + 1 : a), 0);
};

describe('Expected output tests', function() {
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

  describe('Swagger 2', function() {
    it('should not produce any errors or warnings from mock-files/clean.yml', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/clean.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      expect(capturedText.length).toEqual(1);
      expect(capturedText[0].trim()).toEqual(
        './test/cli-validator/mock-files/clean.yml passed the validator'
      );
    });

    it('should produce errors, then warnings from mock-files/err-and-warn.yaml', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      expect(exitCode).toEqual(1);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      const whichProblems = [];
      capturedText.forEach(function(line) {
        if (line.includes('errors')) {
          whichProblems.push('errors');
        }
        if (line.includes('warnings')) {
          whichProblems.push('warnings');
        }
      });

      expect(whichProblems[0]).toEqual('errors');
      expect(whichProblems[1]).toEqual('warnings');
    });

    it.each(['-v', '--verbose'])(
      'should display the associated rule with each error and warning',
      async function(option) {
        const exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/err-and-warn.yaml'
        ]);
        expect(exitCode).toEqual(1);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const messageCount = count(capturedText, /^\s*Message\s*:/);
        const ruleCount = count(capturedText, /^\s*Rule\s*:/);
        expect(messageCount).toEqual(ruleCount);
      }
    );

    it.each(['-j', '--json'])(
      'should include the validator version in JSON output',
      async function(option) {
        const exitcode = await testValidator([
          option,
          './test/cli-validator/mock-files/clean.yml'
        ]);
        expect(exitcode).toBe(0);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const jsonOutput = JSON.parse(capturedText);
        const expectedValidatorVersion = require('../../../package.json')
          .version;
        expect(jsonOutput.version).toBeTruthy();
        expect(jsonOutput.version).toBe(expectedValidatorVersion);
      }
    );

    it.each(['-j', '--json'])(
      'should include the associated rule with each error and warning in JSON output',
      async function(option) {
        const exitcode = await testValidator([
          option,
          './test/cli-validator/mock-files/err-and-warn.yaml'
        ]);
        expect(exitcode).toBe(1);

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

    it('should print the correct line numbers for each error/warning', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      expect(exitCode).toEqual(1);

      const capturedText = getCapturedText(consoleSpy.mock.calls);

      // This can be uncommented to display the output when adjustments to
      // the expect statements below are needed.
      // let textOutput = '';
      // capturedText.forEach((elem, index) => {
      //   textOutput += `[${index}]: ${elem}\n`;
      // });
      // originalError(textOutput);

      // .match(/\S+/g) returns an array of all non-whitespace strings
      //   example output would be [ 'Line', ':', '59' ]
      // .match(/\S+/g) returns an array of all non-whitespace strings
      //   example output would be [ 'Line', ':', '59' ]

      // errors
      expect(capturedText[4].match(/\S+/g)[2]).toEqual('59');
      expect(capturedText[9].match(/\S+/g)[2]).toEqual('161');
      // warnings
      expect(capturedText[15].match(/\S+/g)[2]).toEqual('59');
      expect(capturedText[20].match(/\S+/g)[2]).toEqual('131');
      expect(capturedText[25].match(/\S+/g)[2]).toEqual('134');
      expect(capturedText[30].match(/\S+/g)[2]).toEqual('197');
    });

    it('should return exit code of 0 if there are only warnings', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/just-warn.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');
      expect(allOutput.includes('warnings')).toEqual(true);
    });

    it('should handle an array of file names', async function() {
      const args = [
        './test/cli-validator/mock-files/err-and-warn.yaml',
        'notAFile.json',
        './test/cli-validator/mock-files/clean.yml'
      ];
      const exitCode = await testValidator(args);
      expect(exitCode).toEqual(1);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');

      expect(
        allOutput.includes(
          '[Warning] Skipping non-existent file: notAFile.json'
        )
      ).toEqual(true);

      expect(
        allOutput.includes(
          'Validation Results for ./test/cli-validator/mock-files/err-and-warn.yaml:'
        )
      ).toEqual(true);

      expect(
        allOutput.includes(
          'Validation Results for ./test/cli-validator/mock-files/clean.yml:'
        )
      ).toEqual(true);
    });

    it('should not produce any errors or warnings from mock-files/clean-with-tabs.yml', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/clean-with-tabs.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      expect(capturedText.length).toEqual(1);
      expect(capturedText[0].trim()).toEqual(
        './test/cli-validator/mock-files/clean-with-tabs.yml passed the validator'
      );
    });
  });

  describe('OpenAPI 3', function() {
    it('should not produce any errors or warnings from a clean file', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/clean.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');

      expect(allOutput).toContain(
        './test/cli-validator/mock-files/oas3/clean.yml passed the validator'
      );
    });

    it('should catch problems in a multi-file spec from an outside directory', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/multi-file-spec/main.yaml'
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

    it.each(['-v', '--verbose'])(
      'should display the associated rule with each error and warning',
      async function(option) {
        const exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/oas3/err-and-warn.yaml'
        ]);
        expect(exitCode).toEqual(1);

        const capturedText = getCapturedText(consoleSpy.mock.calls);

        const messageCount = count(capturedText, /^\s*Message\s*:/);
        const ruleCount = count(capturedText, /^\s*Rule\s*:/);
        expect(messageCount).toEqual(ruleCount);
      }
    );

    it.each(['-j', '--json'])(
      'should include the associated rule with each error and warning in JSON output',
      async function(option) {
        const exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/oas3/err-and-warn.yaml'
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

    it.each(['-v', '--verbose'])(
      'should include the path to the component (if it exists) when in verbose mode',
      async function(option) {
        const exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/oas3/component-path-example.yaml'
        ]);
        expect(exitCode).toEqual(0);

        const capturedText = getCapturedText(consoleSpy.mock.calls);
        const allText = capturedText.join();
        expect(allText).toContain('Path');
        expect(allText).toContain('Line');
      }
    );

    it('should include the path to the component (if it exists) when in verbose mode and json mode', async function() {
      const exitCode = await testValidator([
        '-j',
        '-v',
        './test/cli-validator/mock-files/oas3/component-path-example.yaml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const jsonOutput = JSON.parse(capturedText);
      const warningToCheck = jsonOutput.warnings[0];

      expect(warningToCheck.rule).toEqual('collection-array-property');
      expect(warningToCheck.path.join('.')).toBe(
        'components.schemas.ListOfCharacters'
      );
      expect(warningToCheck.line).toEqual(94);
    });
  });
});
