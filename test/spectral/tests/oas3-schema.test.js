const inCodeValidator = require('../../../src/lib');
const { readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');
const { join } = require('path');
const pathToOas3Schema = join(
  __dirname,
  '../mockFiles/oas3/oas3-schema-errors.yml'
);
const oas3Schema = safeLoad(readFileSync(pathToOas3Schema));

describe('spectral - test oas3-schema errors', function() {
  let res;
  let errorMessages;
  let oas3SchemaErrors;

  beforeAll(async function() {
    res = await inCodeValidator(oas3Schema, true);
    oas3SchemaErrors = res.errors.filter(err => err.rule === 'oas3-schema');
    errorMessages = oas3SchemaErrors.map(err => err.message);
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

  describe('spectral - test oas3-schema parameters validation', function() {
    it('should complain when `in` is missing from parameter', function() {
      expect(errorMessages).toContain(
        '`0` property should have required property `in`.'
      );
    });

    it('should complain when `in` value is invalid', function() {
      expect(errorMessages).toContain(
        '`in` property should be equal to one of the allowed values: `path`. Did you mean `path`?.'
      );
    });

    it('should complain when parameter has schema and content', function() {
      expect(errorMessages).toContain('`1` property should not be valid.');
    });
  });

  describe('spectral - test oas3-schema responses validation', function() {
    it('should complain when responses object is empty', function() {
      expect(errorMessages).toContain(
        '`responses` property should not have fewer than 1 properties.'
      );
    });

    it('should complain when response does not have a description', function() {
      expect(errorMessages).toContain(
        '`default` property should have required property `description`.'
      );
    });
  });

  describe('spectral - test oas3-schema openapi object validation', function() {
    it('should return an error when an openapi field is not a string', () => {
      expect(errorMessages).toContain(
        '`openapi` property type should be string.'
      );
    });
  });

  describe('spectral - test oas3-schema info object validation', function() {
    it('should return an error when the info object does not have a version', async function() {
      expect(errorMessages).toContain(
        '`info` property should have required property `version`.'
      );
    });
  });

  describe('spectral - test oas3-schema schema object validation', function() {
    it('should return an error for allOf schema that is not an array', async function() {
      expect(errorMessages).toContain('`allOf` property type should be array.');
    });
  });
});

describe('spectral - additional oas3-schema tests that require an additional spec', function() {
  let res;
  let errorMessages;
  let oas3SchemaErrors;

  beforeAll(async function() {
    const spec = {
      openapi: '3.0'
    };

    res = await inCodeValidator(spec, true);
    oas3SchemaErrors = res.errors.filter(err => err.rule === 'oas3-schema');
    errorMessages = oas3SchemaErrors.map(err => err.message);
  });

  describe('spectral - test oas3-schema openapi object validation', function() {
    it('should return an error when an openapi field is not a string', async function() {
      expect(errorMessages).toContain(
        '`openapi` property should match pattern `^3\\.0\\.\\d(-.+)?$`.'
      );
    });
  });

  describe('spectral - test oas3-schema info object validation', function() {
    it('should return an error when the info object is not provided', async function() {
      expect(errorMessages).toContain(
        'Object should have required property `info`.'
      );
    });
  });
});

describe('spectral - additional oas3-schema tests that require an additional spec', function() {
  let res;
  let errorMessages;
  let oas3SchemaErrors;

  beforeAll(async function() {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0'
      }
    };

    res = await inCodeValidator(spec, true);
    oas3SchemaErrors = res.errors.filter(err => err.rule === 'oas3-schema');
    errorMessages = oas3SchemaErrors.map(err => err.message);
  });

  describe('spectral - test oas3-schema info object validation', function() {
    it('should return an error when the info object does not have a title', async function() {
      expect(errorMessages).toContain(
        '`info` property should have required property `title`.'
      );
    });
  });
});
