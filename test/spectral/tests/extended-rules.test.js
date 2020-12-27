const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('spectral - test extended rules', function() {
  let jsonOutput;

  beforeAll(async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/extended-rules.yml'];
    program.default_mode = true;
    program.json = true;

    await commandLineValidator(program);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    jsonOutput = JSON.parse(capturedText);

    consoleSpy.mockRestore();
  });

  it('test openapi-response-code rule', function() {
    // Verify warnings
    expect(jsonOutput['warnings']['spectral'].length).toBeGreaterThan(0);
    const warnings = jsonOutput['warnings']['spectral'].map(w => w['message']);
    // This is the new warning -- there should be four occurrences
    const warning = 'The response code must be a 3-digit integer or "default".';
    const occurrences = warnings.reduce(
      (a, v) => (v === warning ? a + 1 : a),
      0
    );
    expect(occurrences).toBe(2);
  });
});
