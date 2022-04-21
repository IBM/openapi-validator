const commandLineValidator = require('../../../src/cli-validator/run-validator');
const config = require('../../../src/cli-validator/utils/process-configuration');
const { getCapturedText } = require('../../test-utils');

const defaultConfig = require('../../../src/.defaultsForValidator').defaults;

describe('test info and hint rules - OAS3', function() {
  it('test info and hint rules', async function() {
    // Create custom config with some info and hint settings
    const customConfig = JSON.parse(JSON.stringify(defaultConfig));
    customConfig['shared']['walker']['no_empty_descriptions'] = 'info';
    const mockConfig = jest.spyOn(config, 'get').mockReturnValue(customConfig);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mock-files/oas3/err-and-warn.yaml'];
    program.default_mode = true;
    program.json = true;

    // Note: validator does not set exitcode for jsonOutput
    await commandLineValidator(program);

    // Ensure mockConfig was called and revert it to its original state
    expect(mockConfig).toHaveBeenCalled();
    mockConfig.mockRestore();

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const jsonOutput = JSON.parse(capturedText);
    // Let's leave this here for easier debugging.
    // console.warn("jsonOutput: " + JSON.stringify(jsonOutput, null, 2));

    consoleSpy.mockRestore();

    // errors for non-unique operation ids
    expect(jsonOutput['errors'].length).toBe(3);

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(19);

    // Verify infos
    expect(jsonOutput['infos'].length).toBe(1);
    expect(jsonOutput['infos'][0]['message']).toEqual(
      'Items with a description must have content in it.'
    );
    expect(jsonOutput['infos'][0]['rule']).toEqual('no_empty_descriptions');
  });
});
