const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('Spectral - test custom configuration', function() {
  it('test Spectral info and hint rules', async function() {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.json = true;
    program.ruleset = 'test/spectral/mockFiles/mockConfig/info-and-hint.yaml';

    const exitcode = await commandLineValidator(program);
    expect(exitcode).toBe(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    consoleSpy.mockRestore();
    const jsonOutput = JSON.parse(capturedText);

    // Verify errors
    expect(jsonOutput['errors'].length).toBe(2);

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(10);

    // Verify infos
    expect(jsonOutput['infos'].length).toBe(6);
    expect(jsonOutput['infos'][0]['message']).toEqual(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(jsonOutput['infos'][4]['message']).toEqual(
      'Operation tags should be defined in global tags.'
    );

    // Verify hints
    expect(jsonOutput['hints'].length).toBe(2);
    expect(jsonOutput['hints'][0]['message']).toEqual(
      'OpenAPI object should have non-empty `tags` array.'
    );
    expect(jsonOutput['hints'][1]['message']).toEqual(
      'Operation should have non-empty `tags` array.'
    );
  });

  it('test Spectral custom config that extends ibm:oas', async function() {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.json = true;
    program.ruleset = 'test/spectral/mockFiles/mockConfig/extends-default.yaml';

    const exitcode = await commandLineValidator(program);
    expect(exitcode).toBe(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    consoleSpy.mockRestore();
    const jsonOutput = JSON.parse(capturedText);

    // Verify errors
    expect(jsonOutput['errors'].length).toBe(1);
    expect(jsonOutput['errors'][0]['message']).toEqual(
      'Markdown descriptions should not contain `eval(`.'
    );

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(35);
    const warnings = jsonOutput['warnings'].map(w => w['message']);
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
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.json = true;
    program.ruleset = 'test/spectral/mockFiles/mockConfig/custom-rules.yaml';

    const exitcode = await commandLineValidator(program);
    expect(exitcode).toBe(0);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    consoleSpy.mockRestore();
    const jsonOutput = JSON.parse(capturedText);

    // Verify there are no errors
    expect(jsonOutput['errors']).toBeUndefined();

    // Verify warnings
    expect(jsonOutput['warnings'].length).toBe(40);
    const warnings = jsonOutput['warnings'].map(w => w['message']);
    // This is the new warning -- there should be three occurrences
    const warning = 'All request bodies should have an example.';
    const occurrences = warnings.reduce(
      (a, v) => (v === warning ? a + 1 : a),
      0
    );
    expect(occurrences).toBe(3);
  });
});
