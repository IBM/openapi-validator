/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { Resolver } = require('@stoplight/spectral-ref-resolver');
const Nimma = require('nimma').default;

class Metrics {
  // Holds the callback functions to be paired with each JSONPath.
  // It is an object, with a JSONPath string as each key, and an
  // array of callback functions as each value;
  callbacks;

  // Holds the running counts on each metric we're identifying.
  // It is an object, with the metric name as each key, and an
  // integer count as each value.
  counts;

  // Holds the artifact instances as we encounter them. These are
  // used for de-duplicating instances in the resolved spec.
  // It is an object, with the metric name as each key, and a Set
  // of unique OpenAPI artifacts as each value.
  collectedArtifacts;

  // Holds the unresolved API definition in Object form.
  apiDefinition;

  constructor(unresolvedApiDef) {
    this.apiDefinition = unresolvedApiDef;
    this.callbacks = {};
    this.counts = {};
    this.collectedArtifacts = {};
  }

  /**
   * Defines a metric to track within the API. For a given "name", it registers
   * JSONPath strings, used to gather the OpenAPI artifacts relevant to the given
   * metric, with a condition (implemented as a function) that specifies whether
   * or not the OpenAPI artifact should be "counted" while computing the metrics.
   *
   * @param string metricName - the name of the metric to track - must match 'demoninator'
   *                            fields in the rubric
   * @param []string jsonPaths - list of JSONPath strings to execute the condition against
   * @param function condition - a callback function that defines the condition
   *                             that must be met in order to increment the count
   *                             (accepts an object, returns boolean)
   * @returns void
   */
  register(metricName, jsonPaths, condition) {
    const callback = ({ value, path }) => {
      this.increment(value, path, metricName, condition);
    };

    this.registerCallback(metricName, jsonPaths, callback);
  }

  /**
   * Defines a metric to track within the API, in a way that is specialized for schemas.
   * The condition used to determine whether or not to include a given schema is wrapped
   * within a parent function that recursively looks at nested schemas, since our JSONPath
   * collections will only provide top-level schemas.
   *
   * @param string metricName - the name of the metric to track - must match 'demoninator'
   *                            fields in the rubric
   * @param []string jsonPaths - list of JSONPath strings to execute the condition against
   * @param function condition - a callback function that defines the condition
   *                             that must be met in order to increment the count
   *                             (accepts an object, returns boolean)
   * @returns void
   */
  registerSchemas(metricName, jsonPaths, condition) {
    const callback = ({ value, path }) => {
      validateNestedSchemas(value, path, (schema, pathToSchema) => {
        this.increment(schema, pathToSchema, metricName, condition);
        return []; // validateNestedSchemas expects an array to be returned
      });
    };

    this.registerCallback(metricName, jsonPaths, callback);
  }

  /**
   * Compute all desired metrics for the given API definition. This method
   * takes all registered metrics, along with their JSONPath string and
   * condition functions, and populates all of the metrics data by executing
   * them against the API. The "count" of each metric will then be accessible
   * via the "getData" method.
   *
   * @returns void
   */
  async compute() {
    // The stored API definition will be in its unresolved format. We need to
    // resolve it to enable use to track artifacts through references, etc.
    const resolver = new Resolver();
    const resolved = await resolver.resolve(this.apiDefinition);
    const resolvedApiDefinition = resolved.result;

    // Transform the callbacks into something Nimma can understand - it expects
    // an object, where the keys are JSONPath strings and the values are callback
    // functions to execute against each artifact collected with the JSONPath.
    const jsonPaths = Object.keys(this.callbacks);
    const nimmaCallbacks = {};

    // We potentially have multiple callback functions stored for a given JSONPath.
    // The callback function we define in the Nimma object needs to call all of them.
    Object.entries(this.callbacks).forEach(([jsonPath, functions]) => {
      nimmaCallbacks[jsonPath] = input => functions.forEach(f => f(input));
    });

    // Execute the JSONPaths to count everything at once.
    const nimma = new Nimma(jsonPaths);
    nimma.query(resolvedApiDefinition, nimmaCallbacks);
  }

  /**
   * Retrieves the "count" for a given metric, by name.
   *
   * @param string name - the name of the metric to get the count of
   * @returns integer - the total count for the given metric
   */
  get(name) {
    return this.counts[name];
  }

  /**
   * Provides the ability to see the metric data as a string.
   * Primarily for logging purposes.
   *
   * @returns string - the string representation of the populated metrics object.
   */
  toString() {
    return JSON.stringify(this.counts, null, 2);
  }

  /**
   * A private method that sets the initial values needed
   * for tracking a new metric.
   */
  initializeMetric(metricName) {
    // Initialize the count to 0.
    if (!this.counts[metricName]) {
      this.counts[metricName] = 0;
    }

    // Initialize the artifact collector to an empty Set.
    if (!this.collectedArtifacts[metricName]) {
      this.collectedArtifacts[metricName] = new Set();
    }
  }

  /**
   * A private method that provides the common logic for registering a new
   * metric. It initializes what needs to be initialized and then adds the
   * relevant data to the class.
   */
  registerCallback(metricName, jsonPaths, callback) {
    this.initializeMetric(metricName);

    // Augment and register the callback to each JSONPath.
    jsonPaths.forEach(jp => {
      // Initialize the list of callbacks if necessary.
      if (!this.callbacks[jp]) {
        this.callbacks[jp] = [];
      }

      // Add this callback to the list of functions
      // associated with a given JSONPath.
      this.callbacks[jp].push(input => {
        callback(input);
      });
    });
  }

  /**
   * A private method that provides the common logic for incrementing the "count"
   * of a given metric that we're tracking. It only increments if the user-provided
   * condition holds and the given artifact has not been counted yet.
   */
  increment(value, path, metricName, condition) {
    // Check condition and ensure we don't increment for any duplicates.
    if (
      condition(value, path) &&
      !this.collectedArtifacts[metricName].has(value)
    ) {
      this.counts[metricName]++;
    }

    // Mark the artifact as "counted" by storing it in the collection.
    this.collectedArtifacts[metricName].add(value);
  }
}

module.exports = {
  Metrics,
};
