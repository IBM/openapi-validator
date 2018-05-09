require('babel-polyfill');

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../dist/src/cli-validator/runValidator');

// for an explanation of the text interceptor,
// see the comments for the first test in expectedOutput.js

describe('cli tool - test option handling', function() {
  it('should color output by default', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(txt);
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      if (line !== '\n') {
        expect(line).not.toEqual(stripAnsiFrom(line));
      }
    });
  });

  it('should not color output when -n option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(txt);
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.no_colors = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line).toEqual(stripAnsiFrom(line));
    });
  });

  it('should not print validator source file by default', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line.includes('Validator')).toEqual(false);
    });
  });

  it('should print validator source file when -v option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.print_validator_modules = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    let validatorsPrinted = false;

    capturedText.forEach(function(line) {
      if (line.includes('Validator')) {
        validatorsPrinted = true;
      }
    });

    expect(validatorsPrinted).toEqual(true);
  });

  it('should print correct statistics report when -s option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.report_statistics = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

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
    expect(capturedText[statsSection + 1].match(/\S+/g)[5]).toEqual('4');
    expect(capturedText[statsSection + 2].match(/\S+/g)[5]).toEqual('6');

    // errors
    expect(capturedText[statsSection + 4].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 4].match(/\S+/g)[1]).toEqual('(25%)');

    expect(capturedText[statsSection + 5].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 5].match(/\S+/g)[1]).toEqual('(50%)');

    expect(capturedText[statsSection + 6].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 6].match(/\S+/g)[1]).toEqual('(25%)');

    // warnings
    expect(capturedText[statsSection + 9].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 9].match(/\S+/g)[1]).toEqual('(33%)');

    expect(capturedText[statsSection + 10].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 10].match(/\S+/g)[1]).toEqual('(17%)');

    expect(capturedText[statsSection + 11].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 11].match(/\S+/g)[1]).toEqual('(17%)');

    expect(capturedText[statsSection + 12].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 12].match(/\S+/g)[1]).toEqual('(17%)');

    expect(capturedText[statsSection + 13].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 13].match(/\S+/g)[1]).toEqual('(17%)');
  });

  it('should not print statistics report by default', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line.includes('statistics')).toEqual(false);
    });
  });
});
