// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('test the .thresholdrc limits', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should show error and set exit code to 1 when warning limit exceeded', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/circular-refs.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/five-warnings.json';
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    expect(capturedText[capturedText.length - 1].slice(0, 18)).toEqual(
      `Number of warnings`
    );
  });

  it('should print errors for unsupported limit options and invalid limit values', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/invalid-values.json';
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

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
      './test/cli-validator/mockFiles/thresholds/zero-warnings.json';
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    expect(exitCode).toEqual(0);
  });

  it('should give an error for invalid JSON', async function() {
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/clean.yml'];
    program.limits =
      './test/cli-validator/mockFiles/thresholds/invalid-json.json';
    program.default_mode = true;

    await expect(commandLineValidator(program)).rejects.toBe(2);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const allOutput = capturedText.join('');

    expect(
      allOutput.includes(
        '[Error] There is a problem with the .thresholdrc file.'
      )
    );
  });
});
