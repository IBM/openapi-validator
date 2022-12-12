const commandLineValidator = require('../../../src/cli-validator/run-validator');
const inCodeValidator = require('../../../src/lib');
const swaggerInMemory = require('../mock-files/err-warn-in-memory');
const { getCapturedText } = require('../../test-utils');
const yaml = require('yaml-js');
const fs = require('fs');

const count = (array, regex) => {
  return array.reduce((a, v) => (v.match(regex) ? a + 1 : a), 0);
};

describe('cli tool - test expected output - Swagger 2', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should not produce any errors or warnings from mock-files/clean.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mock-files/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mock-files/clean.yml passed the validator'
    );
    expect(capturedText[1].trim()).toEqual('');
  });

  it('should produce errors, then warnings from mock-files/err-and-warn.yaml', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/err-and-warn.yaml'];
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

  it('should display the associated rule with each error and warning', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/err-and-warn.yaml'];
    program.default_mode = true;
    program.verbose = 1;

    const exitCode = await commandLineValidator(program);
    expect(exitCode).toEqual(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const messageCount = count(capturedText, /^\s*Message\s*:/);
    const ruleCount = count(capturedText, /^\s*Rule\s*:/);
    expect(messageCount).toEqual(ruleCount);
  });

  it('should include the validator version in JSON output', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/clean.yml'];
    program.default_mode = true;
    program.json = true;

    const exitcode = await commandLineValidator(program);
    expect(exitcode).toBe(0);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const jsonOutput = JSON.parse(capturedText);
    const expectedValidatorVersion = require('../../../package.json').version;
    expect(jsonOutput.version).toBeTruthy();
    expect(jsonOutput.version).toBe(expectedValidatorVersion);
  });

  it('should include the validator version in JSON output for the inCodeValidator', async function() {
    const content = fs
      .readFileSync('./test/cli-validator/mock-files/clean.yml')
      .toString();
    const spec = yaml.load(content);

    const defaultMode = true;
    const validationResults = await inCodeValidator(spec, defaultMode);

    const expectedValidatorVersion = require('../../../package.json').version;
    expect(validationResults.version).toBeTruthy();
    expect(validationResults.version).toBe(expectedValidatorVersion);
  });

  it('should include the associated rule with each error and warning in JSON output', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/err-and-warn.yaml'];
    program.default_mode = true;
    program.json = true;

    const exitcode = await commandLineValidator(program);
    expect(exitcode).toBe(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const jsonOutput = JSON.parse(capturedText);

    const msgsByType = Object.assign(
      {},
      jsonOutput.errors,
      jsonOutput.warnings,
      jsonOutput.infos,
      jsonOutput.hints
    );
    const allMessages = Object.entries(msgsByType).reduce(
      (newObj, val) => newObj.concat(val[1]),
      []
    );

    allMessages.forEach(msg => expect(msg).toHaveProperty('rule'));
  });

  it('should include the associated rule in return value of in-memory validator', async function() {
    const content = fs
      .readFileSync('./test/cli-validator/mock-files/err-and-warn.yaml')
      .toString();
    const oas2Object = yaml.load(content);

    const defaultMode = true;
    const validationResults = await inCodeValidator(oas2Object, defaultMode);

    // console.warn(JSON.stringify(validationResults, null, 2));

    expect(validationResults.errors.length).toBe(3);
    expect(validationResults.warnings.length).toBe(6);
    expect(validationResults.infos).not.toBeDefined();
    expect(validationResults.hints).not.toBeDefined();

    validationResults.errors.forEach(msg => expect(msg).toHaveProperty('rule'));
    validationResults.warnings.forEach(msg =>
      expect(msg).toHaveProperty('rule')
    );
  });

  it('should print the correct line numbers for each error/warning', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/err-and-warn.yaml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    // This can be uncommented to display the output when adjustments to
    // the expect statements below are needed.
    // let textOutput = '';
    // capturedText.forEach((elem, index) => {
    //   textOutput += `[${index}]: ${elem}\n`;
    // });
    // console.warn(textOutput);

    expect(exitCode).toEqual(1);

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ 'Line', ':', '59' ]

    // errors
    expect(capturedText[4].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[8].match(/\S+/g)[2]).toEqual('161');
    // warnings
    expect(capturedText[13].match(/\S+/g)[2]).toEqual('59');
    expect(capturedText[17].match(/\S+/g)[2]).toEqual('131');
    expect(capturedText[21].match(/\S+/g)[2]).toEqual('134');
    expect(capturedText[25].match(/\S+/g)[2]).toEqual('197');
  });

  it('should return exit code of 0 if there are only warnings', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/just-warn.yml'];
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
      './test/cli-validator/mock-files/err-and-warn.yaml',
      'notAFile.json',
      './test/cli-validator/mock-files/clean.yml'
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
        'Validation Results for ./test/cli-validator/mock-files/err-and-warn.yaml:'
      )
    ).toEqual(true);

    expect(
      allOutput.includes(
        'Validation Results for ./test/cli-validator/mock-files/clean.yml:'
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

  it('should not produce any errors or warnings from mock-files/clean-with-tabs.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mock-files/clean-with-tabs.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(0);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      './test/cli-validator/mock-files/clean-with-tabs.yml passed the validator'
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
    program.args = ['./test/cli-validator/mock-files/oas3/clean.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(0);
    expect(allOutput).toContain(
      './test/cli-validator/mock-files/oas3/clean.yml passed the validator'
    );
  });

  it('should catch problems in a multi-file spec from an outside directory', async function() {
    const program = {};
    program.args = [
      './test/cli-validator/mock-files/multi-file-spec/main.yaml'
    ];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).toContain('errors');
    expect(allOutput).toContain('Object must have required property "info"');
    expect(allOutput).toContain('warnings');
    expect(allOutput).toContain('Operation must have "operationId"');
    expect(allOutput).toContain(
      'Operation "description" must be present and non-empty string'
    );
  });

  it('should display the associated rule with each error and warning', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/oas3/err-and-warn.yaml'];
    program.default_mode = true;
    program.verbose = 1;

    const exitCode = await commandLineValidator(program);
    expect(exitCode).toEqual(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const messageCount = count(capturedText, /^\s*Message\s*:/);
    const ruleCount = count(capturedText, /^\s*Rule\s*:/);
    expect(messageCount).toEqual(ruleCount);
  });

  it('should include the associated rule with each error and warning in JSON output', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mock-files/oas3/err-and-warn.yaml'];
    program.default_mode = true;
    program.json = true;

    const exitCode = await commandLineValidator(program);
    expect(exitCode).toEqual(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const jsonOutput = JSON.parse(capturedText);

    const msgsByType = Object.assign(
      {},
      jsonOutput.errors,
      jsonOutput.warnings,
      jsonOutput.infos,
      jsonOutput.hints
    );
    const allMessages = Object.entries(msgsByType).reduce(
      (newObj, val) => newObj.concat(val[1]),
      []
    );

    allMessages.forEach(msg => expect(msg).toHaveProperty('rule'));
  });

  it('should include the associated rule in return value of in-memory validator', async function() {
    const content = fs
      .readFileSync('./test/cli-validator/mock-files/oas3/err-and-warn.yaml')
      .toString();
    const oas3Object = yaml.load(content);

    const defaultMode = true;
    const validationResults = await inCodeValidator(oas3Object, defaultMode);

    expect(validationResults.errors.length).toBe(3);
    expect(validationResults.warnings.length).toBe(47);
    expect(validationResults.infos).not.toBeDefined();
    expect(validationResults.hints).not.toBeDefined();

    validationResults.errors.forEach(msg => expect(msg).toHaveProperty('rule'));
    validationResults.warnings.forEach(msg =>
      expect(msg).toHaveProperty('rule')
    );
  });

  it('should include the path to the component (if it exists) when in verbose mode', async function() {
    const program = {};
    program.args = [
      './test/cli-validator/mock-files/oas3/component-path-example.yaml'
    ];
    program.default_mode = true;
    program.verbose = 1;

    const exitCode = await commandLineValidator(program);
    expect(exitCode).toEqual(0);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allText = capturedText.join();
    expect(allText).toContain('Path');
    expect(allText).toContain('Line');
  });

  it('should include the path to the component (if it exists) when in verbose mode and json mode', async function() {
    const program = {};
    program.args = [
      './test/cli-validator/mock-files/oas3/component-path-example.yaml'
    ];
    program.default_mode = true;
    program.verbose = 1;
    program.json = true;

    const exitCode = await commandLineValidator(program);
    expect(exitCode).toEqual(0);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const jsonOutput = JSON.parse(capturedText);
    const warningToCheck = jsonOutput.warnings[0];

    expect(warningToCheck.rule).toEqual('collection-array-property');
    expect(warningToCheck.path.join('.')).toBe(
      'components.schemas.ListOfCharacters'
    );
    expect(warningToCheck.line).toEqual(94);
  });
});
