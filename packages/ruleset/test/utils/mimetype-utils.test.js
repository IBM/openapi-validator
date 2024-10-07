/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isJsonMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
  isFormMimeType,
} = require('../../src/utils');

describe('MimeType utility functions', () => {
  describe('isJsonMimeType()', () => {
    it('should return `false` for `undefined`', () => {
      expect(isJsonMimeType(undefined)).toBe(false);
    });

    it('should return `false` for `null`', () => {
      expect(isJsonMimeType(null)).toBe(false);
    });

    it('should return `false` for empty-string', () => {
      expect(isJsonMimeType('')).toBe(false);
    });

    it('should return `false` for non-JSON mimetype', () => {
      expect(isJsonMimeType('application/octect-stream')).toBe(false);
      expect(isJsonMimeType('text/plain')).toBe(false);
      expect(isJsonMimeType('multipart/form-data; charset=utf-8')).toBe(false);
      expect(isJsonMimeType('application/json charset=utf-8')).toBe(false);
      expect(isJsonMimeType('x application/json')).toBe(false);
      expect(isJsonMimeType('application/json-patch+json')).toBe(false);
      expect(isJsonMimeType('application/merge-patch+json')).toBe(false);
    });

    it('should return `true` for a JSON mimetype', () => {
      expect(isJsonMimeType('application/json')).toBe(true);
      expect(isJsonMimeType('application/json;charset=utf-8')).toBe(true);
      expect(isJsonMimeType('application/json ; charset=utf-8')).toBe(true);
      expect(isJsonMimeType('aPPliCation/jSon')).toBe(true);
      expect(isJsonMimeType('APPLICATION/JSON;CHARSET=UTF-8')).toBe(true);
    });
  });

  describe('isJsonPatchMimeType()', () => {
    it('should return `false` for `undefined`', () => {
      expect(isJsonPatchMimeType(undefined)).toBe(false);
    });

    it('should return `false` for `null`', () => {
      expect(isJsonPatchMimeType(null)).toBe(false);
    });

    it('should return `false` for empty-string', () => {
      expect(isJsonPatchMimeType('')).toBe(false);
    });

    it('should return `false` for non-JSON-Patch mimetype', () => {
      expect(
        isJsonPatchMimeType('application/json-patch+json charset=utf-8')
      ).toBe(false);
      expect(isJsonPatchMimeType('x application/json-patch+json')).toBe(false);
      expect(isJsonPatchMimeType('application/octet-stream')).toBe(false);
      expect(isJsonPatchMimeType('text/html')).toBe(false);
      expect(isJsonPatchMimeType('application/json')).toBe(false);
      expect(isJsonPatchMimeType('application/merge-patch+json')).toBe(false);
    });

    it('should return `true` for a JSON-Patch mimetype', () => {
      expect(isJsonPatchMimeType('application/json-patch+json')).toBe(true);
      expect(
        isJsonPatchMimeType('application/json-patch+json; charset=utf-8')
      ).toBe(true);
      expect(isJsonPatchMimeType('aPPliCation/jSon-PatCh+jsOn')).toBe(true);
      expect(
        isJsonPatchMimeType('APPLICATION/JSON-PATCH+JSON ;CHARSET=UTF-8')
      ).toBe(true);
    });
  });

  describe('isMergePatchMimeType()', () => {
    it('should return `false` for `undefined`', () => {
      expect(isMergePatchMimeType(undefined)).toBe(false);
    });

    it('should return `false` for `null`', () => {
      expect(isMergePatchMimeType(null)).toBe(false);
    });

    it('should return `false` for empty-string', () => {
      expect(isMergePatchMimeType('')).toBe(false);
    });

    it('should return `false` for non-merge-patch mimetype', () => {
      expect(
        isMergePatchMimeType('application/merge-patch+json charset=utf-8')
      ).toBe(false);
      expect(isMergePatchMimeType('x application/merge-patch+json')).toBe(
        false
      );
      expect(isMergePatchMimeType('application/octet-stream')).toBe(false);
      expect(isMergePatchMimeType('text/html')).toBe(false);
      expect(isMergePatchMimeType('application/json')).toBe(false);
      expect(isMergePatchMimeType('application/json-patch+json')).toBe(false);
    });

    it('should return `true` for a merge patch mimetype', () => {
      expect(isMergePatchMimeType('application/merge-patch+json')).toBe(true);
      expect(
        isMergePatchMimeType('application/merge-patch+json; charset=utf-8')
      ).toBe(true);
      expect(isMergePatchMimeType('aPPliCation/mERge-PatCh+jsOn')).toBe(true);
      expect(
        isMergePatchMimeType('APPLICATION/MERGE-PATCH+JSON ;CHARSET=UTF-8')
      ).toBe(true);
    });
  });

  describe('isFormMimeType()', () => {
    it('should return `false` for `undefined`', () => {
      expect(isFormMimeType(undefined)).toBe(false);
    });

    it('should return `false` for `null`', () => {
      expect(isFormMimeType(null)).toBe(false);
    });

    it('should return `false` for empty-string', () => {
      expect(isFormMimeType('')).toBe(false);
    });

    it('should return `false` for non-form mimetype', () => {
      expect(isFormMimeType('application/octect-stream')).toBe(false);
      expect(isFormMimeType('text/plain')).toBe(false);
      expect(isFormMimeType('application/json')).toBe(false);
      expect(isFormMimeType('application/json; charset=utf-8')).toBe(false);
      expect(isFormMimeType('multipart/form-data charset=utf-8')).toBe(false);
      expect(isFormMimeType('application/json-patch+json')).toBe(false);
      expect(isFormMimeType('application/merge-patch+json')).toBe(false);
    });

    it('should return `true` for a form-based mimetype', () => {
      expect(isFormMimeType('multipart/form-data')).toBe(true);
      expect(isFormMimeType('multipart/form-data ; charset=utf-8')).toBe(true);
      expect(isFormMimeType('multipart/mixed')).toBe(true);
      expect(isFormMimeType('MULTIpart/MiXed; CHARSET=utf-8')).toBe(true);
      expect(isFormMimeType('multipart/related')).toBe(true);
      expect(isFormMimeType('multipart/related ;foo=bar')).toBe(true);
      expect(isFormMimeType('application/x-www-form-urlencoded')).toBe(true);
      expect(
        isFormMimeType('application/x-www-form-urlencoded; extrabits=xyz')
      ).toBe(true);
    });
  });
});
