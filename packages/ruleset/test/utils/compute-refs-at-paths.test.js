/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { computeRefsAtPaths } = require('../../src/utils');

describe('Utility function: computeRefsAtPaths()', () => {
  it('should return empty when there are no refs in the nodes', () => {
    const nodes = {
      'my/path/api.yaml': {
        refMap: {},
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual({});
  });

  it('should return empty when there are only refs in non-root file sources', () => {
    const nodes = {
      'my/path/api.yaml#/components/schemas/Pet': {
        refMap: getRefMap(),
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual({});
  });

  it('should return correct refs at paths for yaml files', () => {
    const nodes = {
      'my/path/api.yaml': {
        refMap: getRefMap(),
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual(getExpectedRefsAtPaths());
  });

  it('should return correct refs at paths for yml files', () => {
    const nodes = {
      'my/path/api.yml': {
        refMap: getRefMap(),
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual(getExpectedRefsAtPaths());
  });

  it('should return correct refs at paths for json files', () => {
    const nodes = {
      'my/path/api.json': {
        refMap: getRefMap(),
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual(getExpectedRefsAtPaths());
  });

  it('should return correct refs at paths for root objects (used in programmatic situations)', () => {
    const nodes = {
      root: {
        refMap: getRefMap(),
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual(getExpectedRefsAtPaths());
  });

  it('should return correct refs from multiple files', () => {
    const nodes = {
      'my/path/some-of-the-api.json': {
        refMap: {
          '#/paths/~1pets/get/responses/200/content/application~1json/schema':
            '#/components/schemas/PetCollection',
          '#/paths/~1pets/get/responses/default/content/application~1json/schema':
            '#/components/schemas/Error',
        },
      },
      'my/path/rest-of-the-api.yaml': {
        refMap: {
          '#/paths/~1pets/post/responses/default/content/application~1json/schema':
            '#/components/schemas/Error',
          '#/paths/~1pets/post/responses/201/content/application~1json/schema':
            '#/components/schemas/Pet',
        },
      },
    };

    expect(computeRefsAtPaths(nodes)).toEqual({
      'paths./pets.get.responses.200.content.application/json.schema':
        'components.schemas.PetCollection',
      'paths./pets.get.responses.default.content.application/json.schema':
        'components.schemas.Error',
      'paths./pets.post.responses.default.content.application/json.schema':
        'components.schemas.Error',
      'paths./pets.post.responses.201.content.application/json.schema':
        'components.schemas.Pet',
    });
  });
});

function getRefMap() {
  return {
    '#/paths/~1pets/get/responses/200/content/application~1json/schema':
      '#/components/schemas/PetCollection',
    '#/paths/~1pets/get/responses/default/content/application~1json/schema':
      '#/components/schemas/Error',
    '#/paths/~1pets/post/responses/default/content/application~1json/schema':
      '#/components/schemas/Error',
    '#/paths/~1pets~1%7Bpet_id%7D/get/responses/default/content/application~1json/schema':
      '#/components/schemas/Error',
    '#/paths/~1pets/post/responses/201/content/application~1json/schema':
      '#/components/schemas/Pet',
    '#/paths/~1pets~1%7Bpet_id%7D/get/responses/200/content/application~1json/schema':
      '#/components/schemas/Pet',
    '#/components/schemas/PetCollection/properties/pets/items':
      '#/components/schemas/Pet',
    '#/components/schemas/PetCollection/properties/first/allOf/0':
      '#/components/schemas/PageLink',
    '#/components/schemas/PetCollection/properties/last/allOf/0':
      '#/components/schemas/PageLink',
    '#/components/schemas/PetCollection/properties/previous/allOf/0':
      '#/components/schemas/PageLink',
    '#/components/schemas/PetCollection/properties/next/allOf/0':
      '#/components/schemas/PageLink',
  };
}

function getExpectedRefsAtPaths() {
  return {
    'paths./pets.get.responses.200.content.application/json.schema':
      'components.schemas.PetCollection',
    'paths./pets.get.responses.default.content.application/json.schema':
      'components.schemas.Error',
    'paths./pets.post.responses.default.content.application/json.schema':
      'components.schemas.Error',
    'paths./pets/{pet_id}.get.responses.default.content.application/json.schema':
      'components.schemas.Error',
    'paths./pets.post.responses.201.content.application/json.schema':
      'components.schemas.Pet',
    'paths./pets/{pet_id}.get.responses.200.content.application/json.schema':
      'components.schemas.Pet',
    'components.schemas.PetCollection.properties.pets.items':
      'components.schemas.Pet',
    'components.schemas.PetCollection.properties.first.allOf.0':
      'components.schemas.PageLink',
    'components.schemas.PetCollection.properties.last.allOf.0':
      'components.schemas.PageLink',
    'components.schemas.PetCollection.properties.previous.allOf.0':
      'components.schemas.PageLink',
    'components.schemas.PetCollection.properties.next.allOf.0':
      'components.schemas.PageLink',
  };
}
