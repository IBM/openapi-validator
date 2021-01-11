const path = require('path');
const commandLineValidator = require('../../../src/cli-validator/runValidator');
const config = require('../../../src/cli-validator/utils/processConfiguration');
const { getCapturedText } = require('../../test-utils');

describe('Spectral - test custom configuration', function() {
  it('test Spectral info and hint rules', async function() {
    // Set config to mock .spectral.yml file before running
    const mockPath = path.join(
      __dirname,
      '../mockFiles/mockConfig/info-and-hint.yaml'
    );
    const mockConfig = jest
      .spyOn(config, 'getSpectralRuleset')
      .mockReturnValue(mockPath);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
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

    // Verify errors
    expect(jsonOutput['errors']['spectral'].length).toBe(2);

    // Verify warnings
    expect(jsonOutput['warnings']['spectral'].length).toBe(10);

    // Verify infos
    expect(jsonOutput['infos']['spectral'].length).toBe(5);
    expect(jsonOutput['infos']['spectral'][0]['message']).toEqual(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(jsonOutput['infos']['spectral'][4]['message']).toEqual(
      'Operation tags should be defined in global tags.'
    );

    // Verify hints
    expect(jsonOutput['hints']['spectral'].length).toBe(2);
    expect(jsonOutput['hints']['spectral'][0]['message']).toEqual(
      'OpenAPI object should have non-empty `tags` array.'
    );
    expect(jsonOutput['hints']['spectral'][1]['message']).toEqual(
      'Operation should have non-empty `tags` array.'
    );
  });

  it('test Spectral custom config that extends ibm:oas', async function() {
    // Set config to mock .spectral.yml file before running
    const mockPath = path.join(
      __dirname,
      '../mockFiles/mockConfig/extends-default.yaml'
    );
    const mockConfig = jest
      .spyOn(config, 'getSpectralRuleset')
      .mockReturnValue(mockPath);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
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

    // Verify errors
    expect(jsonOutput['errors']['spectral'].length).toBe(1);
    expect(jsonOutput['errors']['spectral'][0]['message']).toEqual(
      'Markdown descriptions should not contain `eval(`.'
    );

    // Verify warnings
    expect(jsonOutput['warnings']['spectral'].length).toBe(18);
    const warnings = jsonOutput['warnings']['spectral'].map(w => w['message']);
    // This warning should be turned off
    expect(warnings).not.toContain(
      'OpenAPI object should have non-empty `tags` array.'
    );
    // This was redefined from error to warning
    expect(warnings).toContain(
      '`number_of_coins` property type should be integer'
    );
  });

  it('test Spectral custom config that extends ibm:oas with custom rules', async function() {
    // Set config to mock .spectral.yml file before running
    const mockPath = path.join(
      __dirname,
      '../mockFiles/mockConfig/custom-rules.yaml'
    );
    const mockConfig = jest
      .spyOn(config, 'getSpectralRuleset')
      .mockReturnValue(mockPath);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
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

    // Verify there are no errors
    expect(jsonOutput['errors']['spectral']).toBeUndefined();

    // Verify warnings
    expect(jsonOutput['warnings']['spectral'].length).toBe(23);
    const warnings = jsonOutput['warnings']['spectral'].map(w => w['message']);
    // This is the new warning -- there should be three occurrences
    const warning = 'All request bodies should have an example.';
    const occurrences = warnings.reduce(
      (a, v) => (v === warning ? a + 1 : a),
      0
    );
    expect(occurrences).toBe(3);
  });
});
