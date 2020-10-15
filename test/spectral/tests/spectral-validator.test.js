const { getCapturedText } = require('../../test-utils');
const spectralValidator = require('../../../src/spectral/utils/spectral-validator');
const inCodeValidator = require('../../../src/lib');
const oas3InMemory = require('../mockFiles/oas3/enabled-rules-in-memory');
const path = require('path');
const config = require('../../../src/cli-validator/utils/processConfiguration');
const defaultConfig = require('../../../src/.defaultsForValidator');
const defaultObject = defaultConfig.defaults;

describe('spectral - test spectral-validator.js', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test should parse mock spectral result as an error', function() {
    // Create a mock Spectral result object
    const mockResult = [
      {
        code: 'operation-tags',
        message: 'Operation should have non-empty `tags` array.',
        path: ['paths', '/pet', 'put'],
        severity: 0,
        start: { line: 0, character: 0 },
        end: { line: 134, character: 15 }
      }
    ];
    const debug = false;
    const parsedSpectralResults = spectralValidator.parseResults(
      mockResult,
      debug
    );
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(parsedSpectralResults.errors.length).toEqual(1);
    expect(parsedSpectralResults.warnings.length).toEqual(0);
    // Get the resulting error object & run validations
    const errors = parsedSpectralResults.errors;
    expect(errors[0].message).toEqual(mockResult[0].message);
    expect(errors[0].path).toEqual(mockResult[0].path);
    expect(allOutput).not.toContain(
      'There was an error while parsing the spectral results:'
    );
  });

  it('test should parse mock spectral result as a warning', function() {
    // Create a mock Spectral result object
    const mockResult = [
      {
        code: 'operation-tags',
        message: 'Operation should have non-empty `tags` array.',
        path: ['paths', '/pet', 'put'],
        severity: 1,
        start: { line: 0, character: 0 },
        end: { line: 134, character: 15 }
      }
    ];
    const debug = false;
    const parsedSpectralResults = spectralValidator.parseResults(
      mockResult,
      debug
    );
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(parsedSpectralResults.errors.length).toEqual(0);
    expect(parsedSpectralResults.warnings.length).toEqual(1);
    // Get the resulting warning object & run validations
    const warnings = parsedSpectralResults.warnings;
    expect(warnings[0].message).toEqual(mockResult[0].message);
    expect(warnings[0].path).toEqual(mockResult[0].path);
    expect(allOutput).not.toContain(
      'There was an error while parsing the spectral results:'
    );
  });

  it('test should output debug statement when failing to parse mock spectral result: incorrect severity', function() {
    // Create a mock Spectral result object
    const mockResult = [
      {
        code: 'operation-tags',
        message: 'Operation should have non-empty `tags` array.',
        path: ['paths', '/pet', 'put'],
        severity: 'error',
        start: { line: 0, character: 0 },
        end: { line: 134, character: 15 }
      }
    ];
    const debug = true;
    const parsedSpectralResults = spectralValidator.parseResults(
      mockResult,
      debug
    );
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(parsedSpectralResults.errors.length).toEqual(0);
    expect(parsedSpectralResults.warnings.length).toEqual(0);
    expect(allOutput).toContain(
      'There was an error while parsing the spectral results:'
    );
  });

  it('test promise should be rejected when attempting to setup spectral without a valid instance', async function() {
    let spectral;
    await expect(spectralValidator.setup(spectral)).rejects.toEqual(
      'Error (spectral-validator): An instance of spectral has not been initialized.'
    );
  });
});

describe('spectral - test config file changes with .spectral.yml', function() {
  let validationResults;
  let errors;
  let warnings;

  beforeAll(async () => {
    // Set config to mock .spectral.yml file before running
    const mockPath = path.join(
      __dirname,
      '../mockFiles/mockConfig/.mockSpectral.yaml'
    );
    const mockConfig = jest
      .spyOn(config, 'getSpectralRuleset')
      .mockReturnValue(mockPath);

    // Below is used from enabled-rules.test.js
    // set up mock user input
    const defaultMode = false;
    validationResults = await inCodeValidator(oas3InMemory, defaultMode);

    // Ensure mockConfig was called and revert it to its original state
    expect(mockConfig).toHaveBeenCalled();
    mockConfig.mockRestore();

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  // One test should be an error instead of a warning compared to the enable-rules.test.js
  it('test no-eval-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
    expect(warnings).not.toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
  });

  // Other tests should be their default severity levels
  it('test no-script-tags-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
  });
});

describe('spectral - test config file changes with .validaterc', function() {
  let validationResults;
  let errors;
  let warnings;

  beforeAll(async () => {
    // Create a mockObject from the defaultObject and mock config.get()
    const mockObject = Object.assign({}, defaultObject);
    mockObject.spectral.rules['no-script-tags-in-markdown'] = 'error';
    const mockConfig = jest.spyOn(config, 'get').mockReturnValue(mockObject);

    // Below is used from enabled-rules.test.js
    // set up mock user input
    const defaultMode = false;
    validationResults = await inCodeValidator(oas3InMemory, defaultMode);

    // Ensure mockConfig was called and revert it to its original state
    expect(mockConfig).toHaveBeenCalled();
    mockConfig.mockRestore();

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  // One test should be an error instead of a warning compared to the enable-rules.test.js
  it('test no-script-tags-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(warnings).not.toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
  });

  // Other tests should be their default severity levels
  it('test no-eval-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
  });
});

describe('spectral - test config file changes with .validaterc, all rules off', function() {
  let validationResults;

  beforeAll(async () => {
    // Create a mockObject from the defaultObject and mock config.get()
    const mockObject = Object.assign({}, defaultObject);
    mockObject.spectral.rules = {
      'no-eval-in-markdown': 'off',
      'no-script-tags-in-markdown': 'off',
      'openapi-tags': 'off',
      'operation-description': 'off',
      'operation-tags': 'off',
      'operation-tag-defined': 'off',
      'path-keys-no-trailing-slash': 'off',
      'typed-enum': 'off',
      'oas2-api-host': 'off',
      'oas2-api-schemes': 'off',
      'oas2-host-trailing-slash': 'off',
      'oas2-valid-example': 'off',
      'oas2-valid-definition-example': 'off',
      'oas2-anyOf': 'off',
      'oas2-oneOf': 'off',
      'oas3-api-servers': 'off',
      'oas3-examples-value-or-externalValue': 'off',
      'oas3-server-trailing-slash': 'off',
      'oas3-valid-example': 'off',
      'oas3-valid-schema-example': 'off'
    };
    const mockConfig = jest.spyOn(config, 'get').mockReturnValue(mockObject);

    // set up mock user input
    const defaultMode = false;
    validationResults = await inCodeValidator(oas3InMemory, defaultMode);

    // Ensure mockConfig was called and revert it to its original state
    expect(mockConfig).toHaveBeenCalled();
    mockConfig.mockRestore();
  });

  // There should be no errors and 2 warnings for a non-spectral rule
  it('test no spectral errors and no spectral warnings', function() {
    expect(validationResults.errors.length).toBe(0);
    expect(validationResults.warnings.length).toBe(2);
  });
});
