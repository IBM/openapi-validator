// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');

const commandLineValidator = require('../../../src/cli-validator/runValidator');

describe('test the .thresholdrc limits', function() {
  it('should show error and set exit code to 1 when warning limit exceeded', async function() {
    const capturedText = [];

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/circularRefs.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/fiveWarnings.json';
    program.default_mode = true;

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const exitCode = await commandLineValidator(program);

    unhookIntercept();

    expect(exitCode).toEqual(1);

    expect(capturedText[capturedText.length - 1].slice(0, 18)).toEqual(
      `Number of warnings`
    );
  });

  it('should print errors for unsupported limit options and invalid limit values', async function() {
    const capturedText = [];

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/invalidValues.json';
    program.default_mode = true;

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const exitCode = await commandLineValidator(program);

    unhookIntercept();

    // limit values invalid, so default limit, Number.MAX_VALUE, used
    expect(exitCode).toEqual(0);

    const allOutput = capturedText.join('');

    expect(allOutput.includes('"population" limit not supported.')).toEqual(
      true
    );

    expect(allOutput.includes('Value provided for warnings')).toEqual(true);
  });

  it('should give exit code 0 when warnings limit not exceeded', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/zeroWarnings.json';
    program.default_mode = true;

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const exitCode = await commandLineValidator(program);

    unhookIntercept();

    expect(exitCode).toEqual(0);
  });

  it('should give an error for invalid JSON', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/invalidJSON.json';
    program.default_mode = true;

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    await expect(commandLineValidator(program)).rejects.toBe(2);

    unhookIntercept();

    const allOutput = capturedText.join('');

    expect(
      allOutput.includes(
        '[Error] There is a problem with the .thresholdrc file.'
      )
    );
  });
});
