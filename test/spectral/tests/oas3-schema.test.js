const inCodeValidator = require('../../../src/lib');
const { readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');
const { join } = require('path');
const pathToOas3Schema = join(__dirname, '../mockFiles/oas3/oas3-schema.yml');
const oas3Schema = safeLoad(readFileSync(pathToOas3Schema));

describe('spectral - test oas3-schema errors', function() {
  let res;
  let errorMessages;

  beforeAll(async function() {
    res = await inCodeValidator(oas3Schema, true);
    errorMessages = res.errors.map(err => err.message);
  });

  describe('spectral - test oas3-schema discriminator validation', function() {
    it('should catch discriminator field is not an object', function() {
      expect(errorMessages).toContain(
        '`discriminator` property type should be object.'
      );
    });

    it('should catch discriminator object does not have propertyName field', function() {
      expect(errorMessages).toContain(
        '`discriminator` property should have required property `propertyName`.'
      );
    });

    it('should catch propertyName field in discriminator is not a string', function() {
      expect(errorMessages).toContain(
        '`propertyName` property type should be string.'
      );
    });
  });

  describe('spectral - test oas3-schema operations validation', function() {
    it('should complain about a request body not having a content field', function() {
      expect(errorMessages).toContain(
        '`requestBody` property should have required property `content`.'
      );
    });
  });
});
