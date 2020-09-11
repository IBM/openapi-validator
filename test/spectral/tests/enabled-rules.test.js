const commandLineValidator = require('../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../src/lib');
const { getCapturedText } = require('../../test-utils');
const swaggerInMemory = require('../mockFiles/swagger/enabled-rules-in-memory');
const oas3InMemory = require('../mockFiles/oas3/enabled-rules-in-memory');
const re = /^Validator: spectral/;

describe('spectral - test enabled rules - Swagger 2', function() {
  let consoleSpy;
  let allOutput;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    allOutput = capturedText.join('');
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
    // Since some spectral validations will result in errors, the exit code should equal 1
    expect(exitCode).toEqual(1);
    expect(foundOtherValidator).toBe(false);
  });

  afterEach(() => {
    allOutput = '';
    consoleSpy.mockRestore();
  });

  it('test no-eval-in-markdown rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `eval(`'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `<script>` tags'
    );
  });

  it('test openapi-tags rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'OpenAPI object should have non-empty `tags` array'
    );
  });

  it('test operation-description rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Operation `description` must be present and non-empty string'
    );
  });

  it('test operation-tags rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain('Operation should have non-empty `tags` array');
  });

  it('test operation-tag-defined rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Operation tags should be defined in global tags'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain('paths should not end with a slash');
  });

  it('test typed-enum rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Enum value `a_string` does not respect the specified type `integer`'
    );
  });

  it('test oas2-api-host rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'OpenAPI `host` must be present and non-empty string'
    );
  });

  it('test oas2-api-schemes rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'OpenAPI host `schemes` must be present and non-empty array'
    );
  });

  it('test oas2-valid-example rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      '`number_of_coins` property type should be integer'
    );
  });

  it('test oas2-anyOf rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });

  it('test oas2-oneOf rule using mockFiles/swagger/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });
});

describe('spectral - test enabled rules - Swagger 2 In Memory', function() {
  let validationResults;
  let errors;
  let warnings;

  beforeEach(async () => {
    // set up mock user input
    const defaultMode = true;
    validationResults = await inCodeValidator(swaggerInMemory, defaultMode);

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    validationResults = '';
    errors = '';
    warnings = '';
  });

  it('test no-eval-in-markdown rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `eval(``.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
  });

  it('test openapi-tags rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object should have non-empty `tags` array.'
    );
    expect(warnings).toContain(
      'OpenAPI object should have non-empty `tags` array.'
    );
  });

  it('test operation-description rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation `description` must be present and non-empty string.'
    );
    expect(warnings).toContain(
      'Operation `description` must be present and non-empty string.'
    );
  });

  it('test operation-tags rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation should have non-empty `tags` array.'
    );
    expect(warnings).toContain('Operation should have non-empty `tags` array.');
  });

  it('test operation-tag-defined rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation tags should be defined in global tags.'
    );
    expect(warnings).toContain(
      'Operation tags should be defined in global tags.'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain('paths should not end with a slash.');
    expect(warnings).toContain('paths should not end with a slash.');
  });

  it('test typed-enum rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Enum value `a_string` does not respect the specified type `integer`.'
    );
    expect(warnings).toContain(
      'Enum value `a_string` does not respect the specified type `integer`.'
    );
  });

  it('test oas2-api-host rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI `host` must be present and non-empty string.'
    );
    expect(warnings).toContain(
      'OpenAPI `host` must be present and non-empty string.'
    );
  });

  it('test oas2-api-schemes rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI host `schemes` must be present and non-empty array.'
    );
    expect(warnings).toContain(
      'OpenAPI host `schemes` must be present and non-empty array.'
    );
  });

  it('test oas2-valid-example rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).toContain(
      '`number_of_coins` property type should be integer'
    );
    expect(warnings).not.toContain(
      '`number_of_coins` property type should be integer'
    );
  });

  it('test oas2-anyOf rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
    expect(warnings).toContain(
      'anyOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });

  it('test oas2-oneOf rule using mockFiles/swagger/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
    expect(warnings).toContain(
      'oneOf is not available in OpenAPI v2, it was added in OpenAPI v3'
    );
  });
});

describe('spectral - test enabled rules - OAS3', function() {
  let consoleSpy;
  let allOutput;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/enabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    allOutput = capturedText.join('');
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
    // Since some spectral validations will result in errors, the exit code should equal 1
    expect(exitCode).toEqual(1);
    expect(foundOtherValidator).toBe(false);
  });

  afterEach(() => {
    allOutput = '';
    consoleSpy.mockRestore();
  });

  it('test no-eval-in-markdown rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `eval(`'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Markdown descriptions should not contain `<script>` tags'
    );
  });

  it('test openapi-tags rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'OpenAPI object should have non-empty `tags` array'
    );
  });

  it('test operation-description rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Operation `description` must be present and non-empty string'
    );
  });

  it('test operation-tags rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain('Operation should have non-empty `tags` array');
  });

  it('test operation-tag-defined rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Operation tags should be defined in global tags'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain('paths should not end with a slash');
  });

  it('test typed-enum rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Enum value `a_string` does not respect the specified type `integer`'
    );
  });

  it('test oas3-api-servers rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'OpenAPI `servers` must be present and non-empty array'
    );
  });

  it('test oas3-examples-value-or-externalValue rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      'Examples should have either a `value` or `externalValue` field'
    );
  });

  it('test oas3-valid-example rule using mockFiles/oas3/enabled-rules.yml', function() {
    expect(allOutput).toContain(
      '`number_of_coins` property type should be integer'
    );
  });
});

describe('spectral - test enabled rules - OAS3 In Memory', function() {
  let validationResults;
  let errors;
  let warnings;

  beforeEach(async () => {
    // set up mock user input
    const defaultMode = true;
    validationResults = await inCodeValidator(oas3InMemory, defaultMode);

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    validationResults = '';
    errors = '';
    warnings = '';
  });

  it('test no-eval-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `eval(``.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `eval(`.'
    );
  });

  it('test no-script-tags-in-markdown rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
    expect(warnings).toContain(
      'Markdown descriptions should not contain `<script>` tags.'
    );
  });

  it('test openapi-tags rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object should have non-empty `tags` array.'
    );
    expect(warnings).toContain(
      'OpenAPI object should have non-empty `tags` array.'
    );
  });

  it('test operation-description rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation `description` must be present and non-empty string.'
    );
    expect(warnings).toContain(
      'Operation `description` must be present and non-empty string.'
    );
  });

  it('test operation-tags rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation should have non-empty `tags` array.'
    );
    expect(warnings).toContain('Operation should have non-empty `tags` array.');
  });

  it('test operation-tag-defined rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation tags should be defined in global tags.'
    );
    expect(warnings).toContain(
      'Operation tags should be defined in global tags.'
    );
  });

  it('test path-keys-no-trailing-slash rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain('paths should not end with a slash.');
    expect(warnings).toContain('paths should not end with a slash.');
  });

  it('test typed-enum rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Enum value `a_string` does not respect the specified type `integer`.'
    );
    expect(warnings).toContain(
      'Enum value `a_string` does not respect the specified type `integer`.'
    );
  });

  it('test oas3-api-servers rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI `servers` must be present and non-empty array.'
    );
    expect(warnings).toContain(
      'OpenAPI `servers` must be present and non-empty array.'
    );
  });

  it('test oas3-examples-value-or-externalValue rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Examples should have either a `value` or `externalValue` field.'
    );
    expect(warnings).toContain(
      'Examples should have either a `value` or `externalValue` field.'
    );
  });

  it('test oas3-valid-example rule using mockFiles/oas3/enabled-rules-in-memory', function() {
    expect(errors).toContain(
      '`number_of_coins` property type should be integer'
    );
    expect(warnings).not.toContain(
      '`number_of_coins` property type should be integer'
    );
  });
});
