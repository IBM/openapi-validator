/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaNamingConvention } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaNamingConvention;
const ruleId = 'ibm-schema-naming-convention';
const expectedSeverity = severityCodes.warning;

function collectionSchemaMessage(genericPath, canonicalSchemaName) {
  return `Collection schema for path '${genericPath}' should use the name: ${canonicalSchemaName}Collection`;
}

function resourceListItemsSchemaMessage(
  resourceListPropName,
  canonicalSchemaName
) {
  return `Items schema for collection resource list property '${resourceListPropName}' should use the name: ${canonicalSchemaName} or ${canonicalSchemaName}Summary`;
}

function postPrototypeSchemaMessage(genericPath, canonicalSchemaName) {
  return `Prototype schema (POST request body) for path '${genericPath}' should use the name: ${canonicalSchemaName}Prototype`;
}

function putPrototypeSchemaMessage(specificPath, canonicalSchemaName) {
  return `Prototype schema (PUT request body) for path '${specificPath}' should use the name: ${canonicalSchemaName}Prototype`;
}

function patchSchemaMessage(specificPath, canonicalSchemaName) {
  return `Patch schema for path '${specificPath}' should use the name: ${canonicalSchemaName}Patch`;
}

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Collection schema and list property items schema are correctly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.CoinCollection = {
        properties: {
          coins: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Coin',
            },
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Collection schema is correctly named and resource list prop items use summary schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.CoinSummary = {};
      testDocument.components.schemas.CoinCollection = {
        properties: {
          coins: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CoinSummary',
            },
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Unidentifiable resource list property items schema is incorrectly named', async () => {
      // Note that the list property having the correct name is validated
      // for in a separate rule (ibm-collection-array-property)
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.CoinLike = {};
      testDocument.components.schemas.CoinCollection = {
        properties: {
          list_o_coins: {
            // would be detected if this was named 'coins'
            type: 'array',
            items: {
              $ref: '#/components/schemas/CoinLike',
            },
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Collection schema would be incorrectly named but there is no canonical schema for reference', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CoinBunch = {};
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinBunch',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Prototype schema in POST request body is correctly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessPrototype = {};
      testDocument.paths['/v1/messes'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessPrototype',
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Prototype schema in POST request body uses canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessPrototype = {};
      testDocument.paths['/v1/messes'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Mess',
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Prototype schema in PUT request body is correctly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessPrototype = {};
      testDocument.paths['/v1/messes'] = {};
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessPrototype',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Prototype schema in PUT request body uses canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessPrototype = {};
      testDocument.paths['/v1/messes'] = {};
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Mess',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Prototype schema in PUT request body is incorrectly named but the path is not resource-oriented', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessMaker = {};
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessMaker',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Patch schema is correctly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Jeans = {};
      testDocument.components.schemas.JeansPatch = {};
      testDocument.paths['/v1/jeans'] = {};
      testDocument.paths['/v1/jeans/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Jeans',
                  },
                },
              },
            },
          },
        },
        patch: {
          requestBody: {
            content: {
              'application/merge-patch+json; charset=utf-8': {
                schema: {
                  $ref: '#/components/schemas/JeansPatch',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Collection schema is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.Coins = {
        properties: {
          coins: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Coin',
            },
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coins',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(collectionSchemaMessage('/v1/coins', 'Coin'));
      expect(r.path.join('.')).toBe(
        'paths./v1/coins.get.responses.200.content.application/json.schema'
      );
    });

    it('Collection resource list property items schema is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.SingleCoin = {};
      testDocument.components.schemas.CoinCollection = {
        properties: {
          coins: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SingleCoin',
            },
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json; charset=utf-8': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(resourceListItemsSchemaMessage('coins', 'Coin'));
      expect(r.path.join('.')).toBe(
        'paths./v1/coins.get.responses.200.content.application/json; charset=utf-8.schema.properties.coins.items'
      );
    });

    it('Collection resource list property items schema (referenced) is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.SingleCoin = {};
      testDocument.components.schemas.CoinList = {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SingleCoin',
        },
      };
      testDocument.components.schemas.CoinCollection = {
        properties: {
          coins: {
            $ref: '#/components/schemas/CoinList',
          },
        },
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(resourceListItemsSchemaMessage('coins', 'Coin'));
      expect(r.path.join('.')).toBe(
        'paths./v1/coins.get.responses.200.content.application/json.schema.properties.coins.items'
      );
    });

    it('Collection resource list property items schema (in composed model) is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Coin = {};
      testDocument.components.schemas.CoinsOne = {
        properties: {
          coins: {
            $ref: '#/components/schemas/CoinList',
          },
          other_data: {
            type: 'string',
          },
        },
      };
      testDocument.components.schemas.CoinsTwo = {
        properties: {
          coins: {
            $ref: '#/components/schemas/CoinList',
          },
          extra_data: {
            type: 'string',
          },
        },
      };
      testDocument.components.schemas.CollectionBase = {};
      testDocument.components.schemas.SingleCoin = {};
      testDocument.components.schemas.CoinList = {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SingleCoin',
        },
      };
      testDocument.components.schemas.CoinCollection = {
        allOf: [
          {
            $ref: '#/components/schemas/CollectionBase',
          },
          {
            oneOf: [
              {
                $ref: '#/components/schemas/CoinsOne',
              },
              {
                $ref: '#/components/schemas/CoinsTwo',
              },
            ],
          },
        ],
      };
      testDocument.paths['/v1/coins'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CoinCollection',
                  },
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/coins/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Coin',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(resourceListItemsSchemaMessage('coins', 'Coin'));
      expect(r.path.join('.')).toBe(
        'paths./v1/coins.get.responses.200.content.application/json.schema.allOf.1.oneOf.0.properties.coins.items'
      );
    });

    it('Prototype schema in POST request body is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessMaker = {};
      testDocument.paths['/v1/messes'] = {
        post: {
          requestBody: {
            content: {
              'application/json; charset=utf-8': {
                schema: {
                  $ref: '#/components/schemas/MessMaker',
                },
              },
            },
          },
        },
      };
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(postPrototypeSchemaMessage('/v1/messes', 'Mess'));
      expect(r.path.join('.')).toBe(
        'paths./v1/messes.post.requestBody.content.application/json; charset=utf-8.schema'
      );
    });

    it('Prototype schema in referenced POST request body is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessMaker = {};
      testDocument.components.requestBodies.MessCreation = {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MessMaker',
            },
          },
        },
      };
      testDocument.paths['/v1/messes'] = {
        post: {
          requestBody: {
            $ref: '#/components/requestBodies/MessCreation',
          },
        },
      };
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(postPrototypeSchemaMessage('/v1/messes', 'Mess'));
      expect(r.path.join('.')).toBe(
        'paths./v1/messes.post.requestBody.content.application/json.schema'
      );
    });

    it('Prototype schema in PUT request body is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Mess = {};
      testDocument.components.schemas.MessMaker = {};
      testDocument.paths['/v1/messes'] = {};
      testDocument.paths['/v1/messes/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Mess',
                  },
                },
              },
            },
          },
        },
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessMaker',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(
        putPrototypeSchemaMessage('/v1/messes/{id}', 'Mess')
      );
      expect(r.path.join('.')).toBe(
        'paths./v1/messes/{id}.put.requestBody.content.application/json.schema'
      );
    });

    it('Patch schema (merge patch) is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Jeans = {};
      testDocument.components.schemas.JeansUpdater = {};
      testDocument.paths['/v1/jeans'] = {};
      testDocument.paths['/v1/jeans/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Jeans',
                  },
                },
              },
            },
          },
        },
        patch: {
          requestBody: {
            content: {
              'application/merge-patch+json; charset=utf-8': {
                schema: {
                  $ref: '#/components/schemas/JeansUpdater',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(patchSchemaMessage('/v1/jeans/{id}', 'Jeans'));
      expect(r.path.join('.')).toBe(
        'paths./v1/jeans/{id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema'
      );
    });

    it('Patch schema (json patch) is incorrectly named', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Jeans = {};
      testDocument.components.schemas.JeansUpdater = {};
      testDocument.paths['/v1/jeans'] = {};
      testDocument.paths['/v1/jeans/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Jeans',
                  },
                },
              },
            },
          },
        },
        patch: {
          requestBody: {
            content: {
              'application/json-patch+json': {
                schema: {
                  $ref: '#/components/schemas/JeansUpdater',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.message).toBe(patchSchemaMessage('/v1/jeans/{id}', 'Jeans'));
      expect(r.path.join('.')).toBe(
        'paths./v1/jeans/{id}.patch.requestBody.content.application/json-patch+json.schema'
      );
    });
  });
});
