/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { readFile } = require('node:fs/promises');
const readYaml = require('js-yaml');
const { collections } = require('@ibm-cloud/openapi-ruleset-utilities');
const { Metrics } = require('../../src/scoring-tool/metrics');

describe('scoring-tool metrics tests', function () {
  let apiDef;

  beforeAll(async function () {
    const fileToTest = `${__dirname}/../cli-validator/mock-files/oas3/clean.yml`;
    const contents = await readFile(fileToTest, { encoding: 'utf8' });
    apiDef = readYaml.load(contents);
  });

  it('should initialize members in constructor', function () {
    const metrics = new Metrics(apiDef);

    expect(metrics.apiDefinition).toEqual(apiDef);
    expect(metrics.callbacks).toEqual({});
    expect(metrics.counts).toEqual({});
    expect(metrics.collectedArtifacts).toEqual({});
  });

  it('should register a basic callback that increments the count', function () {
    const metricName = 'paths';
    const jsonPaths = collections.paths;
    const metrics = new Metrics(apiDef);
    const countEveryInstance = jest.fn(() => true);
    const input = { value: '', path: '' };

    metrics.register(metricName, jsonPaths, countEveryInstance);

    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName]).toEqual(new Set());
    jsonPaths.forEach(jp => {
      expect(metrics.callbacks[jp]).toBeInstanceOf(Array);
      metrics.callbacks[jp].forEach(cb => cb(input));
    });

    expect(countEveryInstance).toHaveBeenCalledTimes(jsonPaths.length);
    expect(metrics.counts[metricName]).toBe(jsonPaths.length);
  });

  it('should registerSchemas - recursive callback that increments the count', function () {
    const metricName = 'paths';
    const jsonPaths = collections.paths;
    const metrics = new Metrics(apiDef);
    const countEveryInstance = jest.fn(() => true);
    const input = {
      value: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
      path: ['components', 'schemas', 'Model'],
    };

    expect(metrics.counts[metricName]).toBeUndefined();
    expect(metrics.collectedArtifacts[metricName]).toBeUndefined();

    metrics.registerSchemas(metricName, jsonPaths, countEveryInstance);

    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName]).toEqual(new Set());

    jsonPaths.forEach(jp => {
      expect(metrics.callbacks[jp]).toBeInstanceOf(Array);
      metrics.callbacks[jp].forEach(cb => cb(input));
    });

    // Everything should be called twice, since two schemas will be reported on:
    // the parent and the nested schema.
    const timesCalled = jsonPaths.length * 2;
    expect(countEveryInstance).toHaveBeenCalledTimes(timesCalled);
    expect(metrics.counts[metricName]).toBe(timesCalled);
  });

  it('should compute - populate the metrics', async function () {
    const metricName = 'paths';
    const jsonPaths = collections.paths;
    const metrics = new Metrics(apiDef);
    const countEveryInstance = jest.fn(() => true);

    expect(metrics.counts).toEqual({});
    expect(metrics.collectedArtifacts).toEqual({});

    // Set up a basic callback.
    metrics.register(metricName, jsonPaths, countEveryInstance);

    await metrics.compute();

    expect(metrics.counts[metricName]).toBe(2);
    expect(metrics.collectedArtifacts[metricName].size).toBe(2);

    // Check that the callback received the API paths.
    expect(countEveryInstance.mock.calls.map(c => c[1])).toEqual([
      ['paths', '/pets'],
      ['paths', '/pets/{pet_id}'],
    ]);
  });

  it('should get the count for a given metric', function () {
    const metrics = new Metrics(apiDef);
    metrics.counts = { paths: 4 };
    expect(metrics.get('paths')).toBe(4);
    expect(metrics.get('other')).toBeUndefined();
  });

  it('should toString', function () {
    const metrics = new Metrics(apiDef);
    const counts = { paths: 4 };
    metrics.counts = counts;
    expect(metrics.toString()).toBe(JSON.stringify(counts, null, 2));
  });

  it('should registerCallback - baseline callback registration', function () {
    const metrics = new Metrics(apiDef);
    const metricName = 'paths';
    const jsonPaths = collections.paths;
    const countEveryInstance = jest.fn(() => true);
    const input = { value: '', path: '' };

    expect(metrics.counts[metricName]).toBeUndefined();
    expect(metrics.collectedArtifacts[metricName]).toBeUndefined();

    metrics.registerCallback(metricName, jsonPaths, countEveryInstance);

    // Should initialize the metric values.
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName]).toEqual(new Set());

    // Should store a callback for each JSON path.
    jsonPaths.forEach(jp => {
      expect(metrics.callbacks[jp]).toBeInstanceOf(Array);
      metrics.callbacks[jp].forEach(cb => cb(input));
    });

    expect(countEveryInstance).toHaveBeenCalledTimes(jsonPaths.length);
  });

  it('should increment and store value', function () {
    const metrics = new Metrics(apiDef);
    const metricName = 'paths';
    const mockPath = '/v1/my-path';
    const mockPathObject = { get: 'my-operation' };
    const mockCondition = jest.fn(() => true);

    // These would be initialized by a different method, fake it here.
    metrics.initializeMetric(metricName);

    // Expect there to be no count or storage at the beginning.
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      false
    );

    // Run the increment method.
    metrics.increment(mockPathObject, mockPath, metricName, mockCondition);

    expect(mockCondition).toHaveBeenCalledWith(mockPathObject, mockPath);
    expect(metrics.counts[metricName]).toBe(1);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      true
    );
  });

  it('should not increment if condition returns false', function () {
    const metrics = new Metrics(apiDef);
    const metricName = 'paths';
    const mockPath = '/v1/my-path';
    const mockPathObject = { get: 'my-operation' };
    const mockCondition = jest.fn(() => false);

    // These would be initialized by a different method, fake it here.
    metrics.initializeMetric(metricName);

    // Expect there to be no count or storage at the beginning.
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      false
    );

    // Run the increment method.
    metrics.increment(mockPathObject, mockPath, metricName, mockCondition);

    expect(mockCondition).toHaveBeenCalledWith(mockPathObject, mockPath);
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      true
    );
  });

  it('should not increment if artifact has already been collected', function () {
    const metrics = new Metrics(apiDef);
    const metricName = 'paths';
    const mockPath = '/v1/my-path';
    const mockPathObject = { get: 'my-operation' };
    const mockCondition = jest.fn(() => true);

    // These would be initialized by a different method, fake it here.
    metrics.initializeMetric(metricName);

    // Make it look like we've already visited this artifact.
    metrics.collectedArtifacts[metricName].add(mockPathObject);

    // Expect there to be no count but the object already stored at the beginning.
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      true
    );

    // Run the increment method.
    metrics.increment(mockPathObject, mockPath, metricName, mockCondition);

    expect(mockCondition).toHaveBeenCalledWith(mockPathObject, mockPath);
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName].has(mockPathObject)).toBe(
      true
    );
  });

  it('should initializeMetric', function () {
    const metrics = new Metrics(apiDef);
    const metricName = 'paths';

    // Should start out undefined.
    expect(metrics.counts[metricName]).toBeUndefined();
    expect(metrics.collectedArtifacts[metricName]).toBeUndefined();

    metrics.initializeMetric(metricName);

    // Should be initialized to the baseline values.
    expect(metrics.counts[metricName]).toBe(0);
    expect(metrics.collectedArtifacts[metricName]).toEqual(new Set());
  });
});
