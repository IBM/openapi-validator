const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require("../../../dist/cli-validator/runValidator");

const Sync = require('sync');

// run the tests here

describe("cli tool - option handling", function() {

  it ("should color output by default", function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/errAndWarn.yaml"];

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
});