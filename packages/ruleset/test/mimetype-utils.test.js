const {
  isJsonMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
  isFormMimeType
} = require('../src/utils');

describe('MimeType utility functions', () => {
  it('isJsonMimeType()', async () => {
    expect(isJsonMimeType('application/json')).toBeTruthy();
    expect(isJsonMimeType('application/json; charset=utf-8')).toBeTruthy();
    expect(isJsonMimeType('aPPliCation/jSon')).toBeTruthy();
    expect(isJsonMimeType('APPLICATION/JSON;CHARSET=UTF-8')).toBeTruthy();

    expect(isJsonMimeType('application/json charset=utf-8')).toBeFalsy();
    expect(isJsonMimeType('x application/json')).toBeFalsy();
    expect(isJsonMimeType('application/octet-stream')).toBeFalsy();
    expect(isJsonMimeType('text/html')).toBeFalsy();
    expect(isJsonMimeType('application/json-patch+json')).toBeFalsy();
    expect(isJsonMimeType('application/merge-patch+json')).toBeFalsy();
  });

  it('isJsonPatchMimeType()', async () => {
    expect(isJsonPatchMimeType('application/json-patch+json')).toBeTruthy();
    expect(
      isJsonPatchMimeType('application/json-patch+json; charset=utf-8')
    ).toBeTruthy();
    expect(isJsonPatchMimeType('aPPliCation/jSon-PatCh+jsOn')).toBeTruthy();
    expect(
      isJsonPatchMimeType('APPLICATION/JSON-PATCH+JSON;CHARSET=UTF-8')
    ).toBeTruthy();

    expect(
      isJsonPatchMimeType('application/json-patch+json charset=utf-8')
    ).toBeFalsy();
    expect(isJsonPatchMimeType('x application/json-patch+json')).toBeFalsy();
    expect(isJsonPatchMimeType('application/octet-stream')).toBeFalsy();
    expect(isJsonPatchMimeType('text/html')).toBeFalsy();
    expect(isJsonPatchMimeType('application/json')).toBeFalsy();
    expect(isJsonPatchMimeType('application/merge-patch+json')).toBeFalsy();
  });

  it('isMergePatchMimeType()', async () => {
    expect(isMergePatchMimeType('application/merge-patch+json')).toBeTruthy();
    expect(
      isMergePatchMimeType('application/merge-patch+json; charset=utf-8')
    ).toBeTruthy();
    expect(isMergePatchMimeType('aPPliCation/mERge-PatCh+jsOn')).toBeTruthy();
    expect(
      isMergePatchMimeType('APPLICATION/MERGE-PATCH+JSON;CHARSET=UTF-8')
    ).toBeTruthy();

    expect(
      isMergePatchMimeType('application/merge-patch+json charset=utf-8')
    ).toBeFalsy();
    expect(isMergePatchMimeType('x application/merge-patch+json')).toBeFalsy();
    expect(isMergePatchMimeType('application/octet-stream')).toBeFalsy();
    expect(isMergePatchMimeType('text/html')).toBeFalsy();
    expect(isMergePatchMimeType('application/json')).toBeFalsy();
    expect(isMergePatchMimeType('application/json-patch+json')).toBeFalsy();
  });

  it('isFormMimeType()', async () => {
    expect(isFormMimeType('multipart/form-data')).toBeTruthy();
    expect(isFormMimeType('multipart/form-data;charset=utf-8')).toBeTruthy();
    expect(isFormMimeType('multipart/related; foo=bar')).toBeTruthy();
    expect(isFormMimeType('MULTIpart/MiXed; CHARSET=utf-8')).toBeTruthy();
    expect(isFormMimeType('application/x-www-form-urlencoded')).toBeTruthy();

    expect(isFormMimeType('multipart/form-data charset=utf-8')).toBeFalsy();
    expect(isFormMimeType('application/json')).toBeFalsy();
    expect(isFormMimeType('text/html')).toBeFalsy();
    expect(isFormMimeType('application/json-patch+json')).toBeFalsy();
    expect(isFormMimeType('application/merge-patch+json')).toBeFalsy();
  });
});
