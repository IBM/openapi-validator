const commandLineValidator = require('../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../src/lib');
const swaggerInMemory = require('../mockFiles/err-warn-in-memory');
const { getCapturedText } = require('../../test-utils');

describe('cli tool - test expected output - Swagger 2', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should not produce any errors or warnings from mockFiles/clean.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mockFiles/clean.yml passed the validator'
    );
    expect(capturedText[1].trim()).toEqual('');
  });

  it('should produce errors, then warnings from mockFiles/err-and-warn.yaml', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const whichProblems = [];

    expect(exitCode).toEqual(1);

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
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/err-and-warn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ 'Line', ':', '59' ]

    // errors
    expect(capturedText[4].match(/\S+/g)[2]).toEqual('31');
    expect(capturedText[8].match(/\S+/g)[2]).toEqual('54');
    expect(capturedText[12].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[16].match(/\S+/g)[2]).toEqual('108');
    expect(capturedText[20].match(/\S+/g)[2]).toEqual('172');

    // warnings
    expect(capturedText[25].match(/\S+/g)[2]).toEqual('36');
    expect(capturedText[29].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[33].match(/\S+/g)[2]).toEqual('197');
    expect(capturedText[37].match(/\S+/g)[2]).toEqual('108');
    expect(capturedText[41].match(/\S+/g)[2]).toEqual('131');
    expect(capturedText[45].match(/\S+/g)[2]).toEqual('134');
    expect(capturedText[49].match(/\S+/g)[2]).toEqual('126');
  });

  it('should return exit code of 0 if there are only warnings', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/just-warn.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(0);

    const allOutput = capturedText.join('');
    expect(allOutput.includes('warnings')).toEqual(true);
  });

  it('should handle an array of file names', async function() {
    const program = {};
    program.args = [
      './test/cli-validator/mockFiles/err-and-warn.yaml',
      'notAFile.json',
      './test/cli-validator/mockFiles/clean.yml'
    ];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    const allOutput = capturedText.join('');

    expect(
      allOutput.includes('[Warning] Skipping non-existent file: notAFile.json')
    ).toEqual(true);

    expect(
      allOutput.includes(
        'Validation Results for ./test/cli-validator/mockFiles/err-and-warn.yaml:'
      )
    ).toEqual(true);

    expect(
      allOutput.includes(
        'Validation Results for ./test/cli-validator/mockFiles/clean.yml:'
      )
    ).toEqual(true);
  });

  it('should return errors and warnings using the in-memory module', async function() {
    const defaultMode = true;
    const validationResults = await inCodeValidator(
      swaggerInMemory,
      defaultMode
    );

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);
  });

  it('should not produce any errors or warnings from mockFiles/clean-with-tabs.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean-with-tabs.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mockFiles/clean-with-tabs.yml passed the validator'
    );
    expect(capturedText[1].trim()).toEqual('');
  });
});

describe('test expected output - OpenAPI 3', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should not produce any errors or warnings from a clean file', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/oas3/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(0);
    expect(allOutput).toContain(
      './test/cli-validator/mockFiles/oas3/clean.yml passed the validator'
    );
  });

  it('should catch problems in a multi-file spec from an outside directory', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/multi-file-spec/main.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).toContain('errors');
    expect(allOutput).toContain('API definition must have an `info` object');
    expect(allOutput).toContain('warnings');
    expect(allOutput).toContain(
      'Operations must have a non-empty `operationId`.'
    );
  });
});
