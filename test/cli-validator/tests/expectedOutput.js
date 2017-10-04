const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../dist/cli-validator/runValidator');

const Sync = require('sync');

// run the tests here

describe('cli tool - expected output', function() {

  it ('should not produce any errors or warnings from mockFiles/clean.yml', function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];

    Sync (function() {
      
      commandLineValidator.sync(null, program)
      unhook_intercept();

      try {
        expect(captured_text.length).toEqual(0);
        done();
      }
      catch (err) {
        done(err);
      }

    });

  });

  it ('should produce errors, then warnings from mockFiles/errAndWarn.yaml', function(done) {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];

    Sync (function() {
      
      commandLineValidator.sync(null, program)
      unhook_intercept();

      let whichProblems = [];

      captured_text.forEach(function(line) {
        if (line.includes('errors')) {
          whichProblems.push('errors');
        }
        if (line.includes('warnings')) {
          whichProblems.push('warnings');
        }
      });

      try {
        expect(whichProblems[0]).toEqual('errors');
        expect(whichProblems[1]).toEqual('warnings');
        done();
      }
      catch (err) {
        done(err);
      }

    });

  });

});