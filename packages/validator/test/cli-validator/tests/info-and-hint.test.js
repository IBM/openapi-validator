const commandLineValidator = require('../../../src/cli-validator/run-validator');
const config = require('../../../src/cli-validator/utils/process-configuration');
const { getCapturedText } = require('../../test-utils');

const defaultConfig = require('../../../src/.defaultsForValidator').defaults;

describe('test info and hint rules - OAS3', function() {
  it('test info and hint rules', async function() {
    // Create custom config with some info and hint settings
    const customConfig = JSON.parse(JSON.stringify(defaultConfig));
    customConfig['oas3']['responses']['no_success_response_codes'] = 'info';
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
    expect(jsonOutput['errors'].length).toBe(4);

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(17);

    // Verify infos
    expect(jsonOutput['infos'].length).toBe(2);
    expect(jsonOutput['infos'][0]['message']).toEqual(
      'Each `responses` object SHOULD have at least one code for a successful response.'
    );
  });
});
