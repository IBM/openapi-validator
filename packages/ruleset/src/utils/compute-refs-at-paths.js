/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Takes the graph nodes object computed by the Spectral resolver and converts
 * it to a new format that is better suited for our purposes. The nodes have
 * extra info we don't need and all of the paths are encoded in a unique way.
 * We need to cut out the fluff, decode the paths, and convert the paths
 * to use the dot-separated standard we employ for paths in our rule functions.
 *
 * @param {object} nodes - graph nodes object computed by the Spectral resolver
 * @returns {object} - the re-formatted object
 */

function computeRefsAtPaths(nodes) {
  const resultMap = {};
  Object.keys(nodes).forEach(source => {
    // We need to ensure our source is a file (except when running tests)
    if (
      source.toLowerCase().endsWith('yaml') ||
      source.toLowerCase().endsWith('yml') ||
      source.toLowerCase().endsWith('json') ||
      source === 'root' // This is necessary for running the tests
    ) {
      const refMap = nodes[source].refMap;

      // Each resolved path to a schema is stored with a path to its referenced
      // schema in 'components'. Sub-schemas within components also have their
      // paths stored with the path to the schema they reference. This gathers
      // the paths, transforming them from Spectral's internal format, and maps
      // them to the name of the schema they reference.
      Object.keys(refMap).forEach(pathWithRef => {
        const path = pathWithRef
          .split('/')
          .map(p => decodeURIComponent(p.replaceAll('~1', '/')))
          .join('.')
          .slice(2);
        resultMap[path] = refMap[pathWithRef].slice(2).replaceAll('/', '.');
      });
    }
  });

  return resultMap;
}

module.exports = computeRefsAtPaths;
