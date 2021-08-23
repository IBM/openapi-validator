const commandLineValidator = require('../../../src/cli-validator/runValidator');
const config = require('../../../src/cli-validator/utils/processConfiguration');
const { getCapturedText } = require('../../test-utils');

const defaultConfig = require('../../../src/.defaultsForValidator').defaults;

describe('test info and hint rules - OAS3', function() {
  it('test info and hint rules', async function() {
    // Create custom config with some info and hint settings
    const customConfig = JSON.parse(JSON.stringify(defaultConfig));
    customConfig['shared']['schemas']['no_schema_description'] = 'info';
    customConfig['shared']['operations']['unused_tag'] = 'hint';
    const mockConfig = jest.spyOn(config, 'get').mockReturnValue(customConfig);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/cli-validator/mockFiles/oas3/err-and-warn.yaml'];
    program.default_mode = true;
    program.json = true;

    // Note: validator does not set exitcode for jsonOutput
    await commandLineValidator(program);

    // Ensure mockConfig was called and revert it to its original state
    expect(mockConfig).toHaveBeenCalled();
    mockConfig.mockRestore();

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const jsonOutput = JSON.parse(capturedText);

    consoleSpy.mockRestore();

    // errors for non-unique operation ids
    expect(jsonOutput['errors'].length).toBe(4);

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(37);

    // Verify infos
    expect(jsonOutput['infos'].length).toBe(1);
    expect(jsonOutput['infos'][0]['message']).toEqual(
      'Schema must have a non-empty description.'
    );

    // Verify hints
    expect(jsonOutput['hints'].length).toBe(2);
    expect(jsonOutput['hints'][0]['message']).toEqual(
      'A tag is defined but never used: store'
    );
  });
});
