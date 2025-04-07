/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getNodes, getResolvedSpec, getUnresolvedSpec } = require('../src');

describe('Utility functions: Spectral Context Utils', () => {
  const mockSpectralContextObject = {
    documentInventory: {
      resolved: 'resolved spec',
      graph: {
        nodes: 'graph nodes',
      },
    },
    document: {
      parserResult: {
        data: 'unresolved spec',
      },
    },
  };

  describe('getNodes', () => {
    it('should return graph nodes from context object', async () => {
      expect(getNodes(mockSpectralContextObject)).toBe('graph nodes');
    });
  });

  describe('getResolvedSpec', () => {
    it('should return graph nodes from context object', async () => {
      expect(getResolvedSpec(mockSpectralContextObject)).toBe('resolved spec');
    });
  });

  describe('getUnresolvedSpec', () => {
    it('should return graph nodes from context object', async () => {
      expect(getUnresolvedSpec(mockSpectralContextObject)).toBe(
        'unresolved spec'
      );
    });
  });
});
