const { getCapturedText } = require('../../test-utils');
const spectralValidator = require('../../../src/spectral/utils/spectral-validator');

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
