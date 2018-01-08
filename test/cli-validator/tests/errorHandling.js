require('babel-polyfill');

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../dist/src/cli-validator/runValidator');

// for an explanation of the text interceptor, see the comments for the
// first test in expectedOutput.js

describe('cli tool - test error handling', function() {
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
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = [];
    program.help = helpMessage;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    unhookIntercept();

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
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['json'];

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    unhookIntercept();

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(4);
    expect(capturedText[0].trim()).toEqual('');
    expect(capturedText[1].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: json'
    );
    expect(capturedText[2].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[3].trim()).toEqual(
      '[Error] None of the given arguments are valid files.'
    );
  });

  it('should return an error when there is an invalid file extension', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['badExtension.jsob'];

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    unhookIntercept();

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(4);
    expect(capturedText[0].trim()).toEqual('');
    expect(capturedText[1].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: badExtension.jsob'
    );
    expect(capturedText[2].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[3].trim()).toEqual(
      '[Error] None of the given arguments are valid files.'
    );
  });

  it('should return an error when a file contains an invalid object', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/badJson.json'];

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    unhookIntercept();

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mockFiles/badJson.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'SyntaxError: Unexpected token ; in JSON at position 13'
    );
  });

  it('should return an error when a json file has duplicated key mappings', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/duplicateKeys.json'];

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    } catch (err) {
      exitCode = err;
    }

    unhookIntercept();

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mockFiles/duplicateKeys.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'Syntax error: duplicated keys "version" near sion": "1.'
    );
  });
});
