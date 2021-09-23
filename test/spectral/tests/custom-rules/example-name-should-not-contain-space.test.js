const commandLineValidator = require('../../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../../test-utils');
const { getMessageAndPathFromCapturedText } = require('../../../test-utils');

describe('spectral - examples name should not contain space', () => {
  it('should not display error when examples name does not contain space', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const program = {};
    program.args = [
      './test/spectral/mockFiles/examples-name-should-not-contain-space/positive-case.yaml'
    ];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const messages = getMessageAndPathFromCapturedText(
      'Examples name should not contain space',
      capturedText
    );

    expect(messages.length).toEqual(0);

    expect(exitCode).toEqual(0);
  });

  it('should display error when multiple examples names contain space', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const program = {};
    program.args = [
      './test/spectral/mockFiles/examples-name-should-not-contain-space/negative-case.yaml'
    ];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const messages = getMessageAndPathFromCapturedText(
      'Examples name should not contain space',
      capturedText
    );

    expect(messages[0][1].get('Path')).toEqual(
      'paths./v1/users.get.responses.200.content.application/json.examples.success example'
    );
    expect(messages[1][1].get('Path')).toEqual(
      'paths./v1/users.get.responses.200.content.application/json.examples.failed example'
    );

    expect(exitCode).toEqual(0);
  });
});
