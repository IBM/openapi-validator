const commandLineValidator = require('../../../src/cli-validator/runValidator');
const inCodeValidator = require('../../../src/lib');
const { getCapturedText } = require('../../test-utils');
const swaggerInMemory = require('../mockFiles/swagger/disabled-rules-in-memory');
const oas3InMemory = require('../mockFiles/oas3/disabled-rules-in-memory');

describe('spectral - test disabled rules - Swagger 2', function() {
  let allOutput;

  beforeAll(async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/swagger/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    allOutput = capturedText.join('');
    // Since the default validator still has validations that will result in errors, the
    // exit code should equal 1
    expect(exitCode).toEqual(1);

    consoleSpy.mockRestore();
  });

  it('test contact-properties rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/swagger/disabled-rules.yml', function() {
    // set up mock user input
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test openapi-tags-alphabetical rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object should have alphabetical `tags`'
    );
  });

  it('test path-params rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique'
    );
  });

  it('test operation-operationId rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('Operation should have an `operationId`');
  });

  it('test operation-2xx-response rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation must have at least one `2xx` response'
    );
  });

  it('test operation-parameters validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'A parameter in this operation already exposes the same combination of `name` and `in` values'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'operationId may only use characters that are valid when used in a URL'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/swagger/disabled-rules.yml', function() {
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid'
    );
  });

  it('test operation-default-response rule using mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('Operations must have a default response');
  });

  it('test path-not-include-query rule using mockFiles/swagger/disabled-rules.yml', function() {
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'given keys should not include a query string'
    );
  });

  it('test oas2-unused-definition validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Potentially unused definition has been detected'
    );
  });

  it('test oas2-operation-formData-consume-check validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operations with an `in: formData` parameter must include `application/x-www-form-urlencoded` or `multipart/form-data` in their `consumes` property'
    );
  });

  it('test oas2-operation-security-defined validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation `security` values must match a scheme defined in the `securityDefinitions` object'
    );
  });

  it('test oas2-parameter-description validator rule mockFiles/swagger/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Parameter objects should have a `description`'
    );
  });
});

describe('spectral - test disabled rules - Swagger 2 In Memory', function() {
  let errors;
  let warnings;

  beforeAll(async () => {
    // set up mock user input
    const defaultMode = true;
    const validationResults = await inCodeValidator(
      swaggerInMemory,
      defaultMode
    );

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('test contact-properties rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
    expect(warnings).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('Info object should contain `contact` object');
    expect(warnings).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('License object should include `url`.');
    expect(warnings).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
    expect(warnings).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test openapi-tags-alphabetical rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object should have alphabetical `tags`.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object should have alphabetical `tags`.'
    );
  });

  it('test path-params rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique.'
    );
    expect(warnings).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique.'
    );
  });

  it('test operation-operationId rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('Operation should have an `operationId`.');
    expect(warnings).not.toContain('Operation should have an `operationId`.');
  });

  it('test operation-2xx-response rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation must have at least one `2xx` response.'
    );
    expect(warnings).not.toContain(
      'Operation must have at least one `2xx` response.'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'operationId may only use characters that are valid when used in a URL.'
    );
    expect(warnings).not.toContain(
      'operationId may only use characters that are valid when used in a URL.'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid.'
    );
    expect(warnings).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid.'
    );
  });

  it('test operation-default-response rule using mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('Operations must have a default response.');
    expect(warnings).not.toContain('Operations must have a default response.');
  });

  it('test oas2-unused-definition validator rule mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Potentially unused definition has been detected.'
    );
    expect(warnings).not.toContain(
      'Potentially unused definition has been detected.'
    );
  });

  it('test oas2-operation-security-defined validator rule mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation `security` values must match a scheme defined in the `securityDefinitions` object.'
    );
    expect(warnings).not.toContain(
      'Operation `security` values must match a scheme defined in the `securityDefinitions` object.'
    );
  });

  it('test oas2-parameter-description validator rule mockFiles/swagger/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Parameter objects should have a `description`.'
    );
    expect(warnings).not.toContain(
      'Parameter objects should have a `description`.'
    );
  });
});

describe(' spectral - test disabled rules - OAS3', function() {
  let allOutput;

  beforeAll(async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // set up mock user input
    const program = {};
    program.args = ['./test/spectral/mockFiles/oas3/disabled-rules.yml'];
    program.default_mode = true;
    program.print_validator_modules = true;

    const exitCode = await commandLineValidator(program);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    allOutput = capturedText.join('');
    // Since the default validator still has validations that will result in errors, the
    // exit code should equal 1
    expect(exitCode).toEqual(1);

    consoleSpy.mockRestore();
  });

  it('test contact-properties rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test openapi-tags-alphabetical rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'OpenAPI object should have alphabetical `tags`'
    );
  });

  it('test operation-default-response rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('Operations must have a default response');
  });

  it('test path-params rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique'
    );
  });

  it('test operation-operationId rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('Operation should have an `operationId`');
  });

  it('test operation-2xx-response rule using mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation must have at least one `2xx` response'
    );
  });

  it('test operation-parameters validator rule mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'A parameter in this operation already exposes the same combination of `name` and `in` values'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'operationId may only use characters that are valid when used in a URL'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/oas3/disabled-rules.yml', function() {
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid'
    );
  });

  it('test path-not-include-query rule using mockFiles/oas3/disabled-rules.yml', function() {
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'given keys should not include a query string'
    );
  });

  it('test oas3-parameter-description validator rule mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Parameter objects should have a `description`'
    );
  });

  it('test oas3-operation-security-defined validator rule mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain(
      'Operation `security` values must match a scheme defined in the `components.securitySchemes` object`'
    );
  });

  it('test oas3-schema validator rule mockFiles/oas3/disabled-rules.yml', function() {
    // rule is disabled, so spectral shouldn't produce a warning
    expect(allOutput).not.toContain('Validator: spectral');
    expect(allOutput).not.toContain('`type` property type should be string.');
  });
});

describe('spectral - test disabled rules - OAS3 In Memory', function() {
  let errors;
  let warnings;

  beforeAll(async () => {
    // set up mock user input
    const defaultMode = true;
    const validationResults = await inCodeValidator(oas3InMemory, defaultMode);

    // should produce an object with `errors` and `warnings` keys that should
    // both be non-empty
    expect(validationResults.errors.length).toBeGreaterThan(0);
    expect(validationResults.warnings.length).toBeGreaterThan(0);

    errors = validationResults.errors.map(error => error.message);
    warnings = validationResults.warnings.map(warn => warn.message);
    expect(errors.length).toBeGreaterThan(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('test contact-properties rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
    expect(warnings).not.toContain(
      'Contact object should have `name`, `url` and `email`.'
    );
  });

  it('test info-contact rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Info object should contain `contact` object.'
    );
    expect(warnings).not.toContain(
      'Info object should contain `contact` object.'
    );
  });

  it('test info-description rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object info `description` must be present and non-empty string.'
    );
  });

  it('test info-license rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object `info` should contain a `license` object.'
    );
  });

  it('test license-url rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('License object should include `url`.');
    expect(warnings).not.toContain('License object should include `url`.');
  });

  it('test no-$ref-siblings rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
    expect(warnings).not.toContain(
      '$ref cannot be placed next to any other properties'
    );
  });

  it('test openapi-tags-alphabetical rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'OpenAPI object should have alphabetical `tags`.'
    );
    expect(warnings).not.toContain(
      'OpenAPI object should have alphabetical `tags`.'
    );
  });

  it('test operation-default-response rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('Operations must have a default response.');
    expect(warnings).not.toContain('Operations must have a default response.');
  });

  it('test path-params rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique.'
    );
    expect(warnings).not.toContain(
      'Path parameter `pet_id` is defined multiple times. Path parameters must be unique.'
    );
  });

  it('test operation-operationId rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('Operation should have an `operationId`.');
    expect(warnings).not.toContain('Operation should have an `operationId`.');
  });

  it('test operation-2xx-response rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation must have at least one `2xx` response.'
    );
    expect(warnings).not.toContain(
      'Operation must have at least one `2xx` response.'
    );
  });

  it('test operation-operationId-valid-in-url validator rule mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'operationId may only use characters that are valid when used in a URL.'
    );
    expect(warnings).not.toContain(
      'operationId may only use characters that are valid when used in a URL.'
    );
  });

  it('test path-declarations-must-exist rule using mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid.'
    );
    expect(warnings).not.toContain(
      'Path parameter declarations cannot be empty, ex.`/given/{}` is invalid.'
    );
  });

  it('test oas3-parameter-description validator rule mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Parameter objects should have a `description`'
    );
    expect(warnings).not.toContain(
      'Parameter objects should have a `description`'
    );
  });

  it('test oas3-operation-security-defined validator rule mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain(
      'Operation `security` values must match a scheme defined in the `components.securitySchemes` object`'
    );
    expect(warnings).not.toContain(
      'Operation `security` values must match a scheme defined in the `components.securitySchemes` object`'
    );
  });

  it('test oas3-schema validator rule mockFiles/oas3/disabled-rules-in-memory', function() {
    expect(errors).not.toContain('`type` property type should be string');
    expect(warnings).not.toContain('`type` property type should be string');
  });
});
