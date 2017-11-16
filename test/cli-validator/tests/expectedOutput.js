require("babel-polyfill");

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../dist/src/cli-validator/runValidator');

describe('cli tool - test expected output', function() {

  it ('should not produce any errors or warnings from mockFiles/clean.yml', async function() {

    // set a variable to store text intercepted from stdout
    let captured_text = [];

    // this variable intercepts incoming text and pushes it into captured_text
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      // by default, text is intercepted AND printed. returning an
      //   empty string prevents any printing
      return '';
    });

    // set up mock user input
    let program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    
    // this stops the interception of output text
    unhook_intercept();

    expect(exitCode).toEqual(0);
    expect(captured_text.length).toEqual(0);
  });

  it ('should produce errors, then warnings from mockFiles/errAndWarn.yaml', async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
        captured_text.push(txt);
        return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhook_intercept();

    let whichProblems = [];

    expect(exitCode).toEqual(1);

    captured_text.forEach(function(line) {
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

  it ('should print the correct line numbers for each error/warning', async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
        captured_text.push(stripAnsiFrom(txt));
        return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    unhook_intercept();

    expect(exitCode).toEqual(1);

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ 'Line', ':', '59' ]
    expect(captured_text[4].match(/\S+/g)[2]).toEqual('59');
    expect(captured_text[8].match(/\S+/g)[2]).toEqual('31');
    expect(captured_text[12].match(/\S+/g)[2]).toEqual('54');
    expect(captured_text[16].match(/\S+/g)[2]).toEqual('108');
    expect(captured_text[21].match(/\S+/g)[2]).toEqual('36');
    expect(captured_text[25].match(/\S+/g)[2]).toEqual('59');
    expect(captured_text[29].match(/\S+/g)[2]).toEqual('134');
    expect(captured_text[33].match(/\S+/g)[2]).toEqual('170');
  });

  it ('should print an error upon catching a circular reference', async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
        captured_text.push(stripAnsiFrom(txt));
        return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/circularRefs.yml'];
    program.default_mode = true;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }
    
    unhook_intercept();

    expect(exitCode).toEqual(2);

    expect(captured_text[0]).toEqual('\nError Circular references detected. See below for details.\n\n');

    expect(captured_text[2].match(/\S+/g)[2]).toEqual('definitions.Pet.properties.category.$ref');
    expect(captured_text[3].match(/\S+/g)[2]).toEqual('176');

    expect(captured_text[6].match(/\S+/g)[2]).toEqual('definitions.Pet.properties.tags.items.$ref');
    expect(captured_text[7].match(/\S+/g)[2]).toEqual('196');
  });
});
