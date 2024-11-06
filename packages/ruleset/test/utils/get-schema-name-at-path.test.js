/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getSchemaNameAtPath } = require('../../src/utils');

describe('Utility function: getSchemaNameAtPath()', () => {
  it('should return undefined if path is undefined', () => {
    expect(getSchemaNameAtPath(undefined, getPathToReferencesMap())).toBe(
      undefined
    );
  });

  it('should return undefined if path is undefined', () => {
    expect(getSchemaNameAtPath(null, getPathToReferencesMap())).toBe(undefined);
  });

  it('should return undefined if path is an empty string', () => {
    expect(getSchemaNameAtPath('', getPathToReferencesMap())).toBe(undefined);
  });

  it('should return undefined if path is not a string', () => {
    expect(getSchemaNameAtPath(42, getPathToReferencesMap())).toBe(undefined);
  });

  it('should return schema names for different paths', () => {
    let path =
      'paths./pets.get.responses.200.content.application/json.schema.properties.pets.items';
    expect(getSchemaNameAtPath(path, getPathToReferencesMap())).toBe('Pet');

    // This exercises the scenario where the same segment is in the path twice ('properties') in this case.
    // There used to be a bug that caused this scenario to produce unintended behavior.
    path =
      'paths./pets/{pet_id}.get.responses.200.content.application/json.schema.properties.something.properties.something_else';
    expect(getSchemaNameAtPath(path, getPathToReferencesMap())).toBe(
      'SomethingElse'
    );
  });
});

function getPathToReferencesMap() {
  return {
    'paths./pets.get.responses.200.content.application/json.schema':
      'components.schemas.PetCollection',
    'components.schemas.PetCollection.properties.pets.items':
      'components.schemas.Pet',
    'paths./pets/{pet_id}.get.responses.200.content.application/json.schema':
      'components.schemas.Pet',
    'paths./pets/{pet_id}.get.responses.200.content.application/json.schema.properties.something':
      'components.schemas.Something',
    'components.schemas.Pet.properties.something':
      'components.schemas.Something',
    'components.schemas.Something.properties.something_else':
      'components.schemas.SomethingElse',
  };
}
