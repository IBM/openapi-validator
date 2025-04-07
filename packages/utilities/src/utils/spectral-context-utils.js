/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Returns the programmatic representation of an OpenAPI document, stored in the
 * Spectral-created "context" object, with all non-circular references resolved.
 * @param {object} context passed as an argument to Spectral-based rule functions
 * @returns {object} the resolved version of an OpenAPI document
 */
function getResolvedSpec(context) {
  return context.documentInventory.resolved;
}

/**
 * Returns the programmatic representation of an OpenAPI document, stored in
 * the Spectral-created "context" object, with all references still intact.
 * @param {object} context passed as an argument to Spectral-based rule functions
 * @returns {object} the unresolved version of an OpenAPI document
 */
function getUnresolvedSpec(context) {
  return context.document.parserResult.data;
}

/**
 * Returns the graph nodes, with information about references and the locations
 * they resolve to, that are computed by the Spectral resolver.
 * @param {object} context passed as an argument to Spectral-based rule functions
 * @returns {object} the graph nodes
 */
function getNodes(context) {
  return context.documentInventory.graph.nodes;
}

module.exports = {
  getNodes,
  getResolvedSpec,
  getUnresolvedSpec,
};
