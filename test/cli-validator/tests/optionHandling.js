require("babel-polyfill");

const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require("../../../dist/src/cli-validator/runValidator");

// for an explanation of the text interceptor,
// see the comments for the first test in expectedOutput.js

describe("cli tool - test option handling", function() {

  it ("should color output by default", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(txt);
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

 
    captured_text.forEach(function(line) {
      if (line !== '\n') {
        expect(line).not.toEqual(stripAnsiFrom(line));
      }
    });
  });

  it("should not color output when -n option is given", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.no_colors = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

    captured_text.forEach(function(line) {
      expect(line).toEqual(stripAnsiFrom(line));
    });
  });

  it("should not print validator source file by default", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

    captured_text.forEach(function(line) {
      expect(line.includes('Validator')).toEqual(false);
    });
  });

  it("should print validator source file when -v option is given", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.print_validator_modules = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

    let validatorsPrinted = false;

    captured_text.forEach(function(line) {
      if (line.includes('Validator')) {
        validatorsPrinted = true;
      }
    });

    expect(validatorsPrinted).toEqual(true);
  });

  it("should print correct statistics report when -s option is given", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.report_statistics = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

    let statisticsReported = false;

    captured_text.forEach(function(line) {
      if (line.includes('statistics')) {
        statisticsReported = true;
      }
    });

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
    expect(statisticsReported).toEqual(true);

    let statsSection = captured_text.findIndex(x => x.includes('statistics'))

    // totals
    expect(captured_text[statsSection+1].match(/\S+/g)[5]).toEqual('4');
    expect(captured_text[statsSection+2].match(/\S+/g)[5]).toEqual('5');

    // errors
    expect(captured_text[statsSection+4].match(/\S+/g)[0]).toEqual('1');
    expect(captured_text[statsSection+4].match(/\S+/g)[1]).toEqual('(25%)');

    expect(captured_text[statsSection+5].match(/\S+/g)[0]).toEqual('2');
    expect(captured_text[statsSection+5].match(/\S+/g)[1]).toEqual('(50%)');

    expect(captured_text[statsSection+6].match(/\S+/g)[0]).toEqual('1');
    expect(captured_text[statsSection+6].match(/\S+/g)[1]).toEqual('(25%)');

    // warnings
    expect(captured_text[statsSection+9].match(/\S+/g)[0]).toEqual('2');
    expect(captured_text[statsSection+9].match(/\S+/g)[1]).toEqual('(40%)');

    expect(captured_text[statsSection+10].match(/\S+/g)[0]).toEqual('1');
    expect(captured_text[statsSection+10].match(/\S+/g)[1]).toEqual('(20%)');

    expect(captured_text[statsSection+11].match(/\S+/g)[0]).toEqual('1');
    expect(captured_text[statsSection+11].match(/\S+/g)[1]).toEqual('(20%)');

    expect(captured_text[statsSection+12].match(/\S+/g)[0]).toEqual('1');
    expect(captured_text[statsSection+12].match(/\S+/g)[1]).toEqual('(20%)');

  });

  it("should not print statistics report by default", async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.default_mode = true;

    await commandLineValidator(program);
    unhook_intercept();

    let statisticsReported = false;

    captured_text.forEach(function(line) {
      expect(line.includes('statistics')).toEqual(false);
    });
  });
});
