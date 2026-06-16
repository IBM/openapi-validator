/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * This package provides utilities for working with OpenAPI 3.x definitions
 * in the context of a Spectral ruleset.
 * @module @ibm-cloud/openapi-ruleset-utilities
 */
import utils from './utils/index.js';
import collections from './collections/index.js';

export default {
  ...utils,

  collections: {
    ...collections,
  },
};
