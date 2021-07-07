const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../src/cli-validator/runValidator');
const modifiedCommander = require('../../../src/cli-validator/utils/modified-commander');
const {
  getCapturedText,
  getCapturedTextWithColor
} = require('../../test-utils');

// for an explanation of the text interceptor,
// see the comments for the first test in expectedOutput.js

describe('cli tool - test option handling', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should color output by default @skip-ci', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedTextWithColor(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      if (line !== '\n') {
        expect(line).not.toEqual(stripAnsiFrom(line));
      }
    });
  });

  it('should not color output when -n option is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.no_colors = true;
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      expect(line).toEqual(stripAnsiFrom(line));
    });
  });

  it('should not print validator source file by default', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      expect(line.includes('Validator')).toEqual(false);
    });
  });

  it('should print validator source file when -p option is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.print_validator_modules = true;
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    let validatorsPrinted = false;

    capturedText.forEach(function(line) {
      if (line.includes('Validator')) {
        validatorsPrinted = true;
      }
    });

    expect(validatorsPrinted).toEqual(true);
  });

  it('should print only errors when the -e command is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.errors_only = true;
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      expect(line.includes('warnings')).toEqual(false);
    });
  });

  it('should print correct statistics report when -s option is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.report_statistics = true;
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    let statisticsReported = false;

    capturedText.forEach(function(line) {
      if (line.includes('statistics')) {
        statisticsReported = true;
      }
    });

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
    expect(statisticsReported).toEqual(true);

    const statsSection = capturedText.findIndex(x => x.includes('statistics'));

    // totals
    expect(capturedText[statsSection + 1].match(/\S+/g)[5]).toEqual('5');
    expect(capturedText[statsSection + 2].match(/\S+/g)[5]).toEqual('8');

    // errors
    expect(capturedText[statsSection + 5].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 5].match(/\S+/g)[1]).toEqual('(20%)');

    expect(capturedText[statsSection + 6].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 6].match(/\S+/g)[1]).toEqual('(40%)');

    expect(capturedText[statsSection + 7].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 7].match(/\S+/g)[1]).toEqual('(20%)');

    expect(capturedText[statsSection + 8].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 8].match(/\S+/g)[1]).toEqual('(20%)');

    // warnings
    expect(capturedText[statsSection + 11].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 11].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 12].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 12].match(/\S+/g)[1]).toEqual('(25%)');

    expect(capturedText[statsSection + 13].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 13].match(/\S+/g)[1]).toEqual('(25%)');

    expect(capturedText[statsSection + 14].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 14].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 15].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 15].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 16].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 16].match(/\S+/g)[1]).toEqual('(13%)');
  });

  it('should not print statistics report by default', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    capturedText.forEach(function(line) {
      expect(line.includes('statistics')).toEqual(false);
    });
  });

  it('should print json output when -j option is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.json = true;
    program.default_mode = true;

    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    // {"line": 59, "message": "Every operation must have a unique `operationId`.", "path": ["paths", "/pet", "put", "operationId"], "rule": "operation-operationId-unique"}
    expect(outputObject['errors'][0]['line']).toEqual(59);
    expect(outputObject['errors'][0]['message']).toEqual(
      'Every operation must have a unique `operationId`.'
    );

    // {"operations-shared": [{"line": 36, "message": "Operations must have a non-empty `operationId`.", "path": "paths./pet.post.operationId"},
    expect(outputObject['warnings'][0]['line']).toEqual(197);
    expect(outputObject['warnings'][0]['message']).toEqual(
      'Potentially unused definition has been detected.'
    );
  });

  it('should print only errors as json output when -j -e option is given', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.json = true;
    program.errors_only = true;
    program.default_mode = true;
    await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    expect(outputObject.warnings).toEqual(undefined);
  });

  it('should change output for overridden options when config file is manually specified', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/just-warn.yml'];
    program.config =
      './test/cli-validator/mockFiles/just-warn-config-override.json';

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    // simple state machine to count the number of warnings and errors.
    let errorCount = 0;
    let warningCount = 0;
    let inErrorBlock = false;
    let inWarningBlock = false;

    capturedText.forEach(function(line) {
      if (line.includes('errors')) {
        inErrorBlock = true;
        inWarningBlock = false;
      } else if (line.includes('warnings')) {
        inErrorBlock = false;
        inWarningBlock = true;
      } else if (line.includes('Message')) {
        if (inErrorBlock) {
          errorCount++;
        } else if (inWarningBlock) {
          warningCount++;
        }
      }
    });
    expect(warningCount).toEqual(3); // without the config this value is 5
    expect(errorCount).toEqual(3); // without the config this value is 0
  });

  it('should return an error and usage menu when there is an unknown option', async function() {
    const noop = () => {};
    const errorStub = jest.spyOn(console, 'error').mockImplementation(noop);
    const exitStub = jest.spyOn(process, 'exit').mockImplementation(noop);
    const helpStub = jest
      .spyOn(modifiedCommander, 'outputHelp')
      .mockImplementation(noop);

    modifiedCommander.unknownOption('r');

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[1][0].trim()).toEqual(
      "error: unknown option `%s'"
    );
    expect(errorStub.mock.calls[1][1].trim()).toEqual('r');
    expect(helpStub).toHaveBeenCalled();
    expect(exitStub).toHaveBeenCalled();
    expect(exitStub.mock.calls[0][0]).toBe(1);
  });
});
