/*
 * @file
 * @copyright IBM Corporation 2017–2024
 * @license Apache-2.0
 */

/**
 * This package provides utilities for working with OpenAPI 3.x definitions
 * in the context of a Spectral ruleset.
 * @module @ibm-cloud/openapi-ruleset-utilities
 */
module.exports = {
  ...require('./utils'),

  collections: {
    ...require('./collections'),
  },
};
