const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('spectral - test disabled rules - Swagger 2', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test contact-properties rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test path-params rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique'
    );
  });

  it('test operation-operationId rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Operation should have an `operationId`');
  });

  it('test operation-2xx-response rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Operation must have at least one `2xx` response'
    );
  });

  it('test operation-operationId-unique rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Every operation must have a unique `operationId'
    );
  });

  it('test operation-parameters validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'A parameter in this operation already exposes the same combination of `name` and `in` values'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'operationId may only use characters that are valid when used in a URL'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid'
    );
  });

  it('test path-not-include-query rule using mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).not.toContain(
      'given keys should not include a query string'
    );
  });

  it('test oas2-unused-definition validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Potentially unused definition has been detected'
    );
  });

  it('test oas2-operation-formData-consume-check validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Operations with an `in: formData` parameter must include `application/x-www-form-urlencoded` or `multipart/form-data` in their `consumes` property'
    );
  });

  it('test oas2-operation-security-defined validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Operation `security` values must match a scheme defined in the `securityDefinitions` object'
    );
  });

  it('test oas2-parameter-description validator rule mockFiles/swagger/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain(
      'Parameter objects should have a `description`'
    );
  });
});

describe(' spectral - test disabled rules - OA3', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test contact-properties rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test path-params rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique'
    );
  });

  it('test operation-operationId rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('Operation should have an `operationId`');
  });

  it('test operation-2xx-response rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation must have at least one `2xx` response'
    );
  });

  it('test operation-operationId-unique rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Every operation must have a unique `operationId'
    );
  });

  it('test operation-parameters validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'A parameter in this operation already exposes the same combination of `name` and `in` values'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'operationId may only use characters that are valid when used in a URL'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid'
    );
  });

  it('test path-not-include-query rule using mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    expect(allOutput).not.toContain(
      'given keys should not include a query string'
    );
  });

  it('test oas3-unused-components-schema validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Potentially unused components schema has been detected'
    );
  });

  it('test oas3-parameter-description validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Parameter objects should have a `description`'
    );
  });

  it('test oas3-operation-security-defined validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation `security` values must match a scheme defined in the `components.securitySchemes` object`'
    );
  });

  it('test oas3-schema validator rule mockFiles/oas3/disabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');

    expect(exitCode).toEqual(1);
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('`type` property type should be string.');
  });
});
