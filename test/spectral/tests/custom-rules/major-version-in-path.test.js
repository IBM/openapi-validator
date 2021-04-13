const commandLineValidator = require('../../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../../src/lib');
const { getCapturedText } = require('../../../test-utils');
const re = /^Validator: spectral/;

describe('spectral - test major-version-in-path rule', function() {
  it('test major-version-in-path using mockFiles/oas3/multiple-major-versions.yml', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = [
      './test/spectral/mockFiles/oas3/multiple-major-versions.yml'
    ];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output, so use regex to verify that
    const validatorsText = allOutput.match(/Validator:\s\w.+/g) || [];
    let foundOtherValidator = false;

    expect(validatorsText.length).toBeGreaterThan(0);

    validatorsText.forEach(text => {
      const match = re.test(text);
      if (!match) {
        foundOtherValidator = true;
      }
    });

    expect(exitCode).toEqual(0);
    expect(foundOtherValidator).toBe(false);

    consoleSpy.mockRestore();

    expect(allOutput).toContain(
      'Major version segments of paths object do not match. Found v1, v2'
    );
  });

  it('test major-version-in-path flags multiple versions in server URLs', async () => {
    // set up mock user input
    const apidef = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Multiple versions in server URLs'
      },
      servers: [
        {
          url: 'http://petstore.swagger.io/v1'
        },
        {
          url: 'http://petstore.swagger.io/v2'
        }
      ],
      paths: {
        '/pets': {
          get: {
            summary: 'Get a list of pets',
            operationId: 'list_pets',
            responses: {
              '200': {
                description: 'Success'
              }
            }
          }
        }
      }
    };
    const validationResults = await inCodeValidator(apidef, true);

    // should produce an object with an empty `errors` key and a non-empty `warnings` key
    expect(validationResults.errors).toBeUndefined();
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    const warnings = validationResults.warnings.map(warn => warn.message);
    expect(warnings.length).toBeGreaterThan(0);

    expect(warnings).toContain(
      'Major version segments of urls in servers object do not match. Found v1, v2'
    );
  });
});
