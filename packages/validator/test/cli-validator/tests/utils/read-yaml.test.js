/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { readYaml } = require('../../../../src/cli-validator/utils/read-yaml');

describe('Read YAML tests', function() {
  it('should read a yaml file and return an object representing the contents', async () => {
    const filepath = __dirname + '/../../../../src/schemas/results-object.yaml';
    const obj = await readYaml(filepath);

    // check some known keys
    expect(obj.title).toBeDefined();
    expect(obj.title).toBe('IBM OpenAPI Validator Results Schema');
    expect(obj.additionalProperties).toBeDefined();
    expect(typeof obj.additionalProperties).toBe('boolean');
    expect(obj.additionalProperties).toBe(false);
    expect(obj.required).toBeDefined();
    expect(Array.isArray(obj.required)).toBe(true);
    expect(obj.properties).toBeDefined();
    expect(typeof obj.properties).toBe('object');
  });

  it('should throw an exception if the file does not exist', async () => {
    await expect(readYaml('../no-file')).rejects.toThrow(
      'ENOENT: no such file or directory'
    );
  });

  it('should throw an exception if the file is invalid yaml', async () => {
    const filepath = __dirname + '/../../mock-files/bad-json.json';
    await expect(readYaml(filepath)).rejects.toThrow();
  });
});
