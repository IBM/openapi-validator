const commandLineValidator = require('../../../src/cli-validator/run-validator');
const { getCapturedText } = require('../../test-utils');

// for an explanation of the text interceptor, see the comments for the
// first test in expectedOutput.js

describe('cli tool - test error handling', function() {
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

  const helpMessage = function() {
    console.log('\n  Usage: validate-swagger [options] <file>\n\n');
    console.log('  Options:\n');
    console.log(
      '    -v, --print_validator_modules  print the validators that catch each error/warning'
    );
    console.log('    -n, --no_colors                turn off output coloring');
    console.log('    -h, --help                     output usage information');
  };

  it('should return an error when there is no filename given', async function() {
    const program = {};
    program.args = [];
    program.default_mode = true;
    program.help = helpMessage;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(5);
    expect(capturedText[0].trim()).toEqual(
      'Usage: validate-swagger [options] <file>'
    );
    expect(capturedText[1].trim()).toEqual('Options:');
    expect(capturedText[2].trim()).toEqual(
      '-v, --print_validator_modules  print the validators that catch each error/warning'
    );
    expect(capturedText[3].trim()).toEqual(
      '-n, --no_colors                turn off output coloring'
    );
    expect(capturedText[4].trim()).toEqual(
      '-h, --help                     output usage information'
    );
  });

  it('should return an error when there is no file extension', async function() {
    const program = {};
    program.args = ['json'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(3);
    expect(capturedText[0].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: json'
    );
    expect(capturedText[1].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[2].trim()).toEqual(
      '[Error] None of the given arguments are valid files.'
    );
  });

  it('should return an error when there is an invalid file extension', async function() {
    const program = {};
    program.args = ['badExtension.jsob'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(3);
    expect(capturedText[0].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: badExtension.jsob'
    );
    expect(capturedText[1].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[2].trim()).toEqual(
      '[Error] None of the given arguments are valid files.'
    );
  });

  it('should return an error when a file contains an invalid object', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/bad-json.json'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mock-files/bad-json.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'SyntaxError: Unexpected token ; in JSON at position 14'
    );
  });

  it('should return an error when a json file has duplicated key mappings', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/duplicate-keys.json'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mock-files/duplicate-keys.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'Syntax error: duplicated keys "version" near sion": "1.'
    );
  });

  it('should return an error when the swagger contains a reference to a missing object', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/missing-object.yml'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] There is a problem with the API definition.'
    );
    expect(capturedText[1].split('\n')[1].trim()).toEqual(
      'Token "NonExistentObject" does not exist.'
    );
  });

  it('should return an error when a JSON document contains a trailing comma', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/trailing-comma.json'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    expect(capturedText[0].trim()).toContain('[Error] Invalid input file');
    expect(capturedText[1].trim()).toEqual(
      'SyntaxError: Unexpected token ] in JSON at position 815'
    );
  });
});
