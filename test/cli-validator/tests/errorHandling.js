require("babel-polyfill");

const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require("../../../dist/src/cli-validator/runValidator");

// for an explanation of the text interceptor, see the comments for the
// first test in expectedOutput.js

describe ("cli tool - test error handling", function() {

  let helpMessage = function() {
    console.log("\n  Usage: validate-swagger [options] <file>\n\n");
    console.log("  Options:\n");
    console.log("    -v, --print_validator_modules  print the validators that catch each error/warning");
    console.log("    -n, --no_colors                turn off output coloring");
    console.log("    -h, --help                     output usage information");
  }

  it ("should return an error when there is no filename given", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = [];
    program.help = helpMessage;

    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(5);
    expect(captured_text[0].trim()).toEqual("Usage: validate-swagger [options] <file>");
    expect(captured_text[1].trim()).toEqual("Options:");
    expect(captured_text[2].trim()).toEqual("-v, --print_validator_modules  print the validators that catch each error/warning");
    expect(captured_text[3].trim()).toEqual("-n, --no_colors                turn off output coloring");
    expect(captured_text[4].trim()).toEqual("-h, --help                     output usage information");
  });

  it ("should return an error when there is no file extension", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["json"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(4);
    expect(captured_text[0].trim()).toEqual("");
    expect(captured_text[1].trim()).toEqual("Warning Skipping file with unsupported file type: json");
    expect(captured_text[2].trim()).toEqual("Supported file types are JSON (.json) and YAML (.yml, .yaml)");
    expect(captured_text[3].trim()).toEqual("Error None of the given arguments are valid files.");
  });

  it ("should return an error when there is an invalid file extension", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["badExtension.jsob"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(2);
    expect(captured_text.length).toEqual(4);
    expect(captured_text[0].trim()).toEqual("");
    expect(captured_text[1].trim()).toEqual("Warning Skipping file with unsupported file type: badExtension.jsob");
    expect(captured_text[2].trim()).toEqual("Supported file types are JSON (.json) and YAML (.yml, .yaml)");
    expect(captured_text[3].trim()).toEqual("Error None of the given arguments are valid files.");
  });

  it ("should return an error when a file contains an invalid object", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/badJson.json"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(1);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0].trim()).toEqual(
      "Error Invalid input file: ./test/cli-validator/mockFiles/badJson.json. See below for details."
    );
    expect(captured_text[1].trim()).toEqual("SyntaxError: Unexpected token ; in JSON at position 13");
  });

  it ("should return an error when a json file has duplicated key mappings", async function() {

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ["./test/cli-validator/mockFiles/duplicateKeys.json"];
    
    let exitCode;
    try {
      exitCode = await commandLineValidator(program);
    }
    catch (err) {
      exitCode = err;
    }

    unhook_intercept();

    expect(exitCode).toEqual(1);
    expect(captured_text.length).toEqual(2);
    expect(captured_text[0].trim()).toEqual(
      "Error Invalid input file: ./test/cli-validator/mockFiles/duplicateKeys.json. See below for details."
    );
    expect(captured_text[1].trim()).toEqual("Syntax error: duplicated keys \"version\" near sion\": \"1.");
  });
});