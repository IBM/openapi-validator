const commandLineValidator = require('../../../src/cli-validator/runValidator');
const { getCapturedText } = require('../../test-utils');

describe('spectral - test enabled rules - Swagger 2', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no-eval-in-markdown rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `eval(`'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `<script>` tags'
    );
  });

  it('test openapi-tags rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'OpenAPI object should have non-empty `tags` array'
    );
  });

  it('test operation-description rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Operation `description` must be present and non-empty string'
    );
  });

  it('test operation-tags rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain('Operation should have non-empty `tags` array');
  });

  it('test operation-tag-defined rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Operation tags should be defined in global tags'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain('paths should not end with a slash');
  });

  it('test typed-enum rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Enum value `a_string` does not respect the specified type `integer`'
    );
  });

  it('test oas2-api-host rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'OpenAPI `host` must be present and non-empty string'
    );
  });

  it('test oas2-api-schemes rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'OpenAPI host `schemes` must be present and non-empty array'
    );
  });

  it('test oas2-valid-example rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      '`number_of_coins` property type should be integer'
    );
  });

  it('test oas2-anyOf rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });

  it('test oas2-oneOf rule using mockFiles/swagger/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });
});

describe('spectral - test enabled rules - OAS3', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('test no-eval-in-markdown rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `eval(`'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `<script>` tags'
    );
  });

  it('test openapi-tags rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'OpenAPI object should have non-empty `tags` array'
    );
  });

  it('test operation-description rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Operation `description` must be present and non-empty string'
    );
  });

  it('test operation-tags rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain('Operation should have non-empty `tags` array');
  });

  it('test operation-tag-defined rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Operation tags should be defined in global tags'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain('paths should not end with a slash');
  });

  it('test typed-enum rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Enum value `a_string` does not respect the specified type `integer`'
    );
  });

  it('test oas3-api-servers rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'OpenAPI `servers` must be present and non-empty array'
    );
  });

  it('test oas3-examples-value-or-externalValue rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      'Examples should have either a `value` or `externalValue` field'
    );
  });

  it('test oas3-valid-example rule using mockFiles/oas3/enabled-rules.yml', async function() {
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    // Spectral should be the only validator module in the output
    const count = (allOutput.match(/Validator:/g) || []).length;

    expect(exitCode).toEqual(1);
    expect(count).toEqual(2);
    expect(allOutput).toContain('Validator: spectral');
    expect(allOutput).toContain(
      '`number_of_coins` property type should be integer'
    );
  });
});
