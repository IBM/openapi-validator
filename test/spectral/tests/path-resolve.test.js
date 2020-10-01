const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('spectral - test file resolve - OAS3', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no file read error using mockFiles/oas3/file-resolver/subdir/main.yaml', async function() {
    // set up mock user input
    const program = {};
    program.default_mode = true;
    program.print_validator_modules = true;
    program.args = [
      './test/spectral/mockFiles/oas3/file-resolver/subdir/main.yaml'
    ];

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    // No errors should be triggered
    expect(exitCode).toEqual(0);
    expect(allOutput).not.toContain('ENOENT: no such file or directory');
  });
});

describe('spectral - test file resolve - Swagger', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no file read error using mockFiles/swagger/file-resolver/subdir/main.yaml', async function() {
    // set up mock user input
    const program = {};
    program.default_mode = true;
    program.print_validator_modules = true;
    program.args = [
      './test/spectral/mockFiles/swagger/file-resolver/subdir/main.yaml'
    ];

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    // No errors should be triggered
    expect(exitCode).toEqual(0);
    expect(allOutput).not.toContain('ENOENT: no such file or directory');
  });
});

describe('spectral - test url resolve - OAS3', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no file read error using mockFiles/oas3/url-reference-resolver/main.yaml', async function() {
    // set up mock user input
    const program = {};
    program.default_mode = true;
    program.print_validator_modules = true;
    program.args = [
      './test/spectral/mockFiles/oas3/url-reference-resolver/main.yaml'
    ];

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    // No errors should be triggered
    expect(exitCode).toEqual(0);
    expect(allOutput).not.toContain('Error resolving $ref pointer');
  });
});

describe('spectral - test url resolve - Swagger', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no file read error using mockFiles/swagger/url-reference-resolver/main.yaml', async function() {
    // set up mock user input
    const program = {};
    program.default_mode = true;
    program.print_validator_modules = true;
    program.args = [
      './test/spectral/mockFiles/swagger/url-reference-resolver/main.yaml'
    ];

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    // No errors should be triggered
    expect(exitCode).toEqual(0);
    expect(allOutput).not.toContain('Error resolving $ref pointer');
  });
});
