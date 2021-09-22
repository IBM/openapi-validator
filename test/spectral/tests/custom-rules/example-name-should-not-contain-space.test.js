const commandLineValidator = require('../../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../../src/lib');
const { getCapturedText } = require('../../../test-utils');
const re = /^Validator: spectral/;

describe('spectral - examples name should not contain space', function() {

  it('should not display error when examples name does not have space', async () => {
    // const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const program = {};
    program.args = [
      './test/spectral/mockFiles/examples-name-should-not-contain-space/positive-case.yaml'
    ];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    // const capturedText = getCapturedText(consoleSpy.mock.calls);
    // const allOutput = capturedText.join('');
    //
    // const validatorsText = allOutput.match(/Validator:\s\w.+/g) || [];
    // // const foundOtherValidator = false;
    //
    // expect(validatorsText.length).toBeGreaterThan(0);
    // expect(exitCode).toEqual(0);
  });

  // it('should display error when examples name contains space', async () => {
  //   const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  //   const program = {};
  //   program.args = [
  //     './test/mockFiles/examples-name-should-not-contain-space/negative-case.yaml'
  //   ];
  //   program.defaul_mode = true;
  //   program.print_validatior_modules = true;
  //
  //   const exitCode = await commandLineValidator(program);
  //   const capturedText = getCapturedText(consoleSpy.mock.calls);
  //   const allOutput = capturedText.join('');
  //
  //   const validatorsText = allOutput.match(/Validator:\s\w.+/g) || [];
  //   // const foundOtherValidator = false;
  //
  //   expect(validatorsText.length).toBeGreaterThan(0);
  //   expect(exitCode).toEqual(0);
  // });

});
