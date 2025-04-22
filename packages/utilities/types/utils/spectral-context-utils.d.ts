/**
 * Returns the graph nodes, with information about references and the locations
 * they resolve to, that are computed by the Spectral resolver.
 * @param {object} context passed as an argument to Spectral-based rule functions
 * @returns {object} the graph nodes
 */
export function getNodes(context: object): object;
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
export function getResolvedSpec(context: object): object;
/**
 * Returns the programmatic representation of an OpenAPI document, stored in
 * the Spectral-created "context" object, with all references still intact.
 * @param {object} context passed as an argument to Spectral-based rule functions
 * @returns {object} the unresolved version of an OpenAPI document
 */
export function getUnresolvedSpec(context: object): object;
//# sourceMappingURL=spectral-context-utils.d.ts.map