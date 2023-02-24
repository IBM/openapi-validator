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

    it('should produce errors, then warnings from mock-files/oas3/err-and-warn.yaml', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml'
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

    it('should print the correct line numbers for each error/warning', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml'
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

      // errors
      expect(capturedText[4].match(/\S+/g)[2]).toEqual('52');
      expect(capturedText[9].match(/\S+/g)[2]).toEqual('96');
      expect(capturedText[14].match(/\S+/g)[2]).toEqual('103');
      // warnings
      expect(capturedText[20].match(/\S+/g)[2]).toEqual('22');
      expect(capturedText[25].match(/\S+/g)[2]).toEqual('24');
      expect(capturedText[30].match(/\S+/g)[2]).toEqual('40');
      expect(capturedText[35].match(/\S+/g)[2]).toEqual('41');
      expect(capturedText[40].match(/\S+/g)[2]).toEqual('52');
      expect(capturedText[45].match(/\S+/g)[2]).toEqual('56');
      expect(capturedText[50].match(/\S+/g)[2]).toEqual('57');
      expect(capturedText[55].match(/\S+/g)[2]).toEqual('59');
      expect(capturedText[60].match(/\S+/g)[2]).toEqual('61');
      expect(capturedText[65].match(/\S+/g)[2]).toEqual('96');
      expect(capturedText[70].match(/\S+/g)[2]).toEqual('102');
      expect(capturedText[75].match(/\S+/g)[2]).toEqual('103');
      expect(capturedText[80].match(/\S+/g)[2]).toEqual('109');
      expect(capturedText[85].match(/\S+/g)[2]).toEqual('138');
      expect(capturedText[90].match(/\S+/g)[2]).toEqual('143');
      expect(capturedText[95].match(/\S+/g)[2]).toEqual('146');
      expect(capturedText[100].match(/\S+/g)[2]).toEqual('149');
      expect(capturedText[105].match(/\S+/g)[2]).toEqual('149');
      expect(capturedText[110].match(/\S+/g)[2]).toEqual('149');
      expect(capturedText[115].match(/\S+/g)[2]).toEqual('162');
      expect(capturedText[120].match(/\S+/g)[2]).toEqual('162');
      expect(capturedText[125].match(/\S+/g)[2]).toEqual('162');
      expect(capturedText[130].match(/\S+/g)[2]).toEqual('180');
      expect(capturedText[135].match(/\S+/g)[2]).toEqual('180');
      expect(capturedText[140].match(/\S+/g)[2]).toEqual('180');
      expect(capturedText[145].match(/\S+/g)[2]).toEqual('192');
      expect(capturedText[150].match(/\S+/g)[2]).toEqual('192');
      expect(capturedText[155].match(/\S+/g)[2]).toEqual('192');
      expect(capturedText[160].match(/\S+/g)[2]).toEqual('213');
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

    it('should handle an array of file names', async function() {
      const args = [
        './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
        'notAFile.json',
        './test/cli-validator/mock-files/oas3/clean.yml'
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
          'Validation Results for ./test/cli-validator/mock-files/oas3/err-and-warn.yaml:'
        )
      ).toEqual(true);

      expect(
        allOutput.includes(
          'Validation Results for ./test/cli-validator/mock-files/oas3/clean.yml:'
        )
      ).toEqual(true);
    });

    it('should not produce any errors or warnings from mock-files/oas3/clean-with-tabs.yml', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/clean-with-tabs.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      expect(capturedText.length).toEqual(1);
      expect(capturedText[0].trim()).toEqual(
        './test/cli-validator/mock-files/oas3/clean-with-tabs.yml passed the validator'
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

    it('should return exit code of 0 if there are only warnings', async function() {
      const exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/just-warn.yml'
      ]);
      expect(exitCode).toEqual(0);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      const allOutput = capturedText.join('');
      expect(allOutput.includes('warnings')).toEqual(true);
    });

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

      expect(warningToCheck.rule).toEqual('ibm-collection-array-property');
      expect(warningToCheck.path.join('.')).toBe(
        'components.schemas.ListOfCharacters'
      );
      expect(warningToCheck.line).toEqual(94);
    });
  });
});
