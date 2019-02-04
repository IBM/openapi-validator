const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../src/lib');
const swaggerInMemory = require('../mockFiles/errWarnInMemory');

describe('cli tool - test expected output - Swagger 2', function() {
  it('should not produce any errors or warnings from mockFiles/clean.yml', async function() {
    // set a variable to store text intercepted from stdout
    const capturedText = [];

    // this variable intercepts incoming text and pushes it into capturedText
    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      // by default, text is intercepted AND printed. returning an
      //   empty string prevents any printing
      return '';
    });

    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    // this stops the interception of output text
    unhookIntercept();

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mockFiles/clean.yml passed the validator'
    );
    expect(capturedText[1].trim()).toEqual('');
  });

  it('should produce errors, then warnings from mockFiles/errAndWarn.yaml', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(txt);
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhookIntercept();

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
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhookIntercept();

    expect(exitCode).toEqual(1);

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ 'Line', ':', '59' ]
    expect(capturedText[4].match(/\S+/g)[2]).toEqual('31');
    expect(capturedText[8].match(/\S+/g)[2]).toEqual('54');
    expect(capturedText[12].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[16].match(/\S+/g)[2]).toEqual('108');
    expect(capturedText[21].match(/\S+/g)[2]).toEqual('36');
    expect(capturedText[25].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[29].match(/\S+/g)[2]).toEqual('197');
    expect(capturedText[33].match(/\S+/g)[2]).toEqual('108');
    expect(capturedText[37].match(/\S+/g)[2]).toEqual('131');
    expect(capturedText[41].match(/\S+/g)[2]).toEqual('134');
    expect(capturedText[45].match(/\S+/g)[2]).toEqual('172');
    expect(capturedText[49].match(/\S+/g)[2]).toEqual('126');
  });

  it('should return exit code of 0 if there are only warnings', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/justWarn.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhookIntercept();

    expect(exitCode).toEqual(0);

    const allOutput = capturedText.join('');
    expect(allOutput.includes('warnings')).toEqual(true);
  });

  it('should handle an array of file names', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = [
      './test/cli-validator/mockFiles/errAndWarn.yaml',
      'notAFile.json',
      './test/cli-validator/mockFiles/clean.yml'
    ];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhookIntercept();

    expect(exitCode).toEqual(1);

    const allOutput = capturedText.join('');

    expect(
      allOutput.includes('[Warning] Skipping non-existent file: notAFile.json')
    ).toEqual(true);

    expect(
      allOutput.includes(
        'Validation Results for ./test/cli-validator/mockFiles/errAndWarn.yaml:'
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

  it('should not produce any errors or warnings from mockFiles/cleanWithTabs.yml', async function() {
    // set a variable to store text intercepted from stdout
    const capturedText = [];

    // this variable intercepts incoming text and pushes it into capturedText
    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      // by default, text is intercepted AND printed. returning an
      //   empty string prevents any printing
      return '';
    });

    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/cleanWithTabs.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    // this stops the interception of output text
    unhookIntercept();

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mockFiles/cleanWithTabs.yml passed the validator'
    );
    expect(capturedText[1].trim()).toEqual('');
  });
});

describe('test expected output - OpenAPI 3', function() {
  it('should not produce any errors or warnings from a clean file', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/oas3/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    unhookIntercept();

    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(0);
    expect(
      allOutput.includes(
        './test/cli-validator/mockFiles/oas3/clean.yml passed the validator'
      )
    ).toEqual(true);
  });
});
