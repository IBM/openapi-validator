/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getConfigFileSchema,
  validateSchema,
} = require('../../../../src/cli-validator/utils');

describe('Schema validator tests', function () {
  let configFileSchema;
  beforeAll(async () => {
    configFileSchema = await getConfigFileSchema();
  });

  it('correct object should validate clean', function () {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
        },
      },
    };

    const fooObj = {
      foo: 'bar',
    };

    const results = validateSchema(fooObj, schema);
    expect(results).toHaveLength(0);
  });

  it('empty config object should validate clean', function () {
    const configObj = {};

    const results = validateSchema(configObj, configFileSchema);
    expect(results).toHaveLength(0);
  });

  it('valid config object should validate clean', function () {
    const configObj = {
      logLevels: {
        root: 'debug',
      },
      limits: {
        warnings: 10,
      },
      ignoreFiles: ['file1'],
    };

    const results = validateSchema(configObj, configFileSchema);
    expect(results).toHaveLength(0);
  });

  it('incorrect object should return an error', function () {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
        },
      },
    };

    const fooObj = {
      foo: 38,
    };

    const results = validateSchema(fooObj, schema);
    expect(results).toHaveLength(1);
  });

  it('invalid config object should return errors', function () {
    const configObj = {
      xlogLevels: {
        root: 'debug',
      },
      limits: {
        xwarnings: 10,
      },
      ignoreFiles: ['file1'],
    };

    const results = validateSchema(configObj, configFileSchema);
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(
      `schema validation error: must NOT have additional properties`
    );
  });
});
