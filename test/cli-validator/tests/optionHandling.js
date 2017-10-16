const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require("../../../dist/cli-validator/runValidator");

const Sync = require('sync');

// for an explanation of the text interceptor and the sync package,
//  see the comments for the first test in expectedOutput.js

describe("cli tool - test option handling", function() {

  it ("should color output by default", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(txt);
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.default_mode = true;

    Sync (function() {
      
      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {
        captured_text.forEach(function(line) {
          if (line !== '\n') {
            expect(line).toNotEqual(stripAnsiFrom(line));
          }
        });
        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

  it("should not color output when -n option is given", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.no_colors = true;
    program.default_mode = true;

    Sync (function() {

      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {
        captured_text.forEach(function(line) {
          expect(line).toEqual(stripAnsiFrom(line));
        });

        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

  it("should not print validator source file by default", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.default_mode = true;

    Sync (function() {

      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {
        captured_text.forEach(function(line) {
          expect(line.includes('Validator')).toEqual(false);
        });

        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

  it("should print validator source file when -v option is given", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.print_validator_modules = true;
    program.default_mode = true;

    Sync (function() {

      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {

        let validatorsPrinted = false;

        captured_text.forEach(function(line) {
          if (line.includes('Validator')) {
            validatorsPrinted = true;
          } 
        });

        expect(validatorsPrinted).toEqual(true);

        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

  it("should print correct statistics report when -s option is given", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];
    program.report_statistics = true;

    Sync (function() {

      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {

        let statisticsReported = false;

        captured_text.forEach(function(line) {
          if (line.includes('statistics')) {
            statisticsReported = true;
          } 
        });

        // .match(/\S+/g) returns an array of all non-whitespace strings
        //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
        expect(statisticsReported).toEqual(true);
        expect(captured_text[29].match(/\S+/g)[0]).toEqual('33%');
        expect(captured_text[30].match(/\S+/g)[0]).toEqual('67%');
        expect(captured_text[33].match(/\S+/g)[0]).toEqual('67%');
        expect(captured_text[34].match(/\S+/g)[0]).toEqual('33%');

        done();
      }
      catch (err) {
        done(err);
      }
    });
  });

  it("should not print statistics report by default", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];

    Sync (function() {

      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {

        let statisticsReported = false;

        captured_text.forEach(function(line) {
          expect(line.includes('statistics')).toEqual(false);
        });

        done();
      }
      catch (err) {
        done(err);
      }
    });
  });
});