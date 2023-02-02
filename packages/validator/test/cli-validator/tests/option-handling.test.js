const stripAnsiFrom = require('strip-ansi');
const {
  getCapturedText,
  getCapturedTextWithColor,
  testValidator
} = require('../../test-utils');

describe('cli tool - test option handling', function() {
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

  it('should colorize output by default @skip-ci', async function() {
    await testValidator(['./test/cli-validator/mock-files/err-and-warn.yaml']);
    const capturedText = getCapturedTextWithColor(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    capturedText.forEach(function(line) {
      if (line) {
        expect(line).not.toEqual(stripAnsiFrom(line));
      }
    });
  });

  it.each(['-n', '--no-colors'])(
    'should not colorize output when -n/--no-colors option is specified',
    async function(option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);

      capturedText.forEach(function(line) {
        expect(line).toEqual(stripAnsiFrom(line));
      });
    }
  );

  it('should not print validator source file by default', async function() {
    await testValidator(['./test/cli-validator/mock-files/err-and-warn.yaml']);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      expect(line.includes('Validator')).toEqual(false);
    });
  });

  it.each(['-e', '--errors-only'])(
    'should print only errors when the -e/--errors-only option is specified',
    async function(option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);

      let foundSummary = false;
      capturedText.forEach(function(line) {
        if (line.includes('summary')) {
          foundSummary = true;
        }
        // It's ok to "see" the word "warnings" in the summary section.
        expect(line.includes('warnings') && !foundSummary).toEqual(false);
      });
    }
  );

  it.each(['-s', '--summary-only'])(
    'should print only the summary when -s/--summary-only option is specified',
    async function(option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // This can be uncommented to display the output when adjustments to
      // the expect statements below are needed.
      // let textOutput = "";
      // capturedText.forEach((elem, index) => {
      //   textOutput += `[${index}]: ${elem}\n`;
      // });
      // originalError(textOutput);

      let summaryReported = false;

      capturedText.forEach(function(line) {
        if (line.includes('summary')) {
          summaryReported = true;
        }
      });

      // .match(/\S+/g) returns an array of all non-whitespace strings
      //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
      expect(summaryReported).toEqual(true);

      const sumSection = capturedText.findIndex(x => x.includes('summary'));
      expect(sumSection).toBe(0);

      // totals
      expect(capturedText[1].match(/\S+/g)[5]).toEqual('2');
      expect(capturedText[2].match(/\S+/g)[5]).toEqual('4');

      // errors
      expect(capturedText[5].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[5].match(/\S+/g)[1]).toEqual('(50%)');

      expect(capturedText[6].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[6].match(/\S+/g)[1]).toEqual('(50%)');

      // warnings
      expect(capturedText[9].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[9].match(/\S+/g)[1]).toEqual('(25%)');

      expect(capturedText[10].match(/\S+/g)[0]).toEqual('2');
      expect(capturedText[10].match(/\S+/g)[1]).toEqual('(50%)');

      expect(capturedText[11].match(/\S+/g)[0]).toEqual('1');
      expect(capturedText[11].match(/\S+/g)[1]).toEqual('(25%)');
    }
  );

  it.each(['-j', '--json'])(
    'should print json output when -j/--json option is specified',
    async function(option) {
      await testValidator([
        option,
        './test/cli-validator/mock-files/err-and-warn.yaml'
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);

      // capturedText should be JSON object. convert to json and check fields
      const outputObject = JSON.parse(capturedText);

      // {"line": 59, "message": "Every operation must have unique "operationId".", "path": ["paths", "/pet", "put", "operationId"], "rule": "operation-operationId-unique"}
      expect(outputObject['errors'][0]['line']).toEqual(59);
      expect(outputObject['errors'][0]['message']).toEqual(
        'Every operation must have unique "operationId".'
      );
    }
  );

  it('should print only errors as json output when -j and -e options are specified together', async function() {
    await testValidator([
      '-j',
      '-e',
      './test/cli-validator/mock-files/err-and-warn.yaml'
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    expect(outputObject.warnings).toEqual(undefined);
  });

  describe.skip('test unknown option handling', function() {
    // This describe block is being skipped altogether because there
    // doesn't seem to be a way for us to capture and verify the
    // output from the "unknownOption" function even though it should
    // end up on console.error.  And, we apparently cannot override
    // the Command instance's "unknownOption" function so that we could
    // better control the output.
    let exitStub;

    beforeEach(() => {
      exitStub = jest.spyOn(process, 'exit').mockImplementation(() => {});
    });

    afterEach(() => {
      exitStub.mockRestore();
    });

    it('should return an error and help text when there is an unknown option', async function() {
      await testValidator(['--unknown-option']);
      // const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);

      // expect(errorStub).toHaveBeenCalled();
      // expect(errorStub.mock.calls[1][0].trim()).toEqual(
      //   "error: unknown option '--unknown-option'"
      // );
      // expect(errorStub.mock.calls[1][1].trim()).toEqual('unknown-option');

      expect(exitStub).toHaveBeenCalled();
      expect(exitStub.mock.calls[0][0]).toBe(1);
    });
  });

  it.each([
    '-lerror',
    '-lroot=error',
    '--log-level=error',
    '--log-level=root=error'
  ])('should not print anything when loglevel is error', async function(
    option
  ) {
    await testValidator([
      option,
      './test/cli-validator/mock-files/err-and-warn.yaml'
    ]);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    expect(capturedText).toHaveLength(0);
  });
});
