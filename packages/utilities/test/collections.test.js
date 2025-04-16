/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { collections } = require('../src');
const testRulePaths = require('./utils/test-rule-paths');

describe('Collections', () => {
  describe('operations', () => {
    const methods = [
      'get',
      'put',
      'post',
      'delete',
      'options',
      'head',
      'patch',
      'trace',
    ];
    for (const method of methods) {
      it(`should find ${method} operations`, async () => {
        const doc = { paths: { '/': { [method]: {} } } };
        const visitedPaths = await testRulePaths(collections.operations, doc);

        expect(visitedPaths).toEqual([['paths', '/', method]]);
      });
    }

    it(`should not find non-operations in a path item`, async () => {
      const doc = {
        paths: {
          '/': {
            summary: 'foo',
            description: 'bar',
            servers: [{ url: 'https://api.example.com/v1' }],
            parameters: [{ name: 'baz', in: 'query' }],
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.operations, doc);

      expect(visitedPaths.length).toEqual(0);
    });
  });

  describe('parameters', () => {
    it(`should find path parameters`, async () => {
      const doc = {
        paths: {
          '/': {
            parameters: [{}],
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.parameters, doc);

      expect(visitedPaths.sort()).toEqual([['paths', '/', 'parameters', 0]]);
    });
    it(`should find operation parameters`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              parameters: [{}],
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.parameters, doc);

      expect(visitedPaths.sort()).toEqual([
        ['paths', '/', 'post', 'parameters', 0],
      ]);
    });
    it(`should not find unreferenced parameters`, async () => {
      const doc = {
        components: {
          parameters: [{}],
        },
      };

      const visitedPaths = await testRulePaths(collections.parameters, doc);

      expect(visitedPaths.length).toEqual(0);
    });
  });

  describe('patchOperations', () => {
    it(`should find patch operations`, async () => {
      const doc = { paths: { '/': { patch: {} } } };

      const visitedPaths = await testRulePaths(
        collections.patchOperations,
        doc
      );

      expect(visitedPaths).toEqual([['paths', '/', 'patch']]);
    });
    it(`should not find non-patch operations`, async () => {
      const doc = {
        paths: {
          '/': {
            get: {},
            put: {},
            post: {},
            delete: {},
            options: {},
            head: {},
            trace: {},
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.patchOperations,
        doc
      );

      expect(visitedPaths.length).toEqual(0);
    });
  });

  describe('paths', () => {
    it(`should find paths`, async () => {
      const doc = {
        paths: {
          '/1': {},
          '/2': {},
          '/3': {},
        },
      };

      const visitedPaths = await testRulePaths(collections.paths, doc);

      expect(visitedPaths).toEqual([
        ['paths', '/1'],
        ['paths', '/2'],
        ['paths', '/3'],
      ]);
    });
  });

  describe('requestBodySchemas', () => {
    it(`should find request body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {},
                  },
                  'application/xml': {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.requestBodySchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
  });

  describe('responseSchemas', () => {
    it(`should find response body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                    'application/xml': {
                      schema: {},
                    },
                  },
                },
                '4xx': {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                    'application/xml': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.responseSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'content',
            'application/xml',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '4xx',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '4xx',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
  });

  describe('schemas', () => {
    it(`should find operation parameter schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              parameters: [{ schema: {} }],
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [['paths', '/', 'post', 'parameters', 0, 'schema']].sort()
      );
    });
    it(`should find operation parameter content schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              parameters: [{ content: { 'application/json': { schema: {} } } }],
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'parameters',
            0,
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find path parameter schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            parameters: [{ schema: {} }],
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [['paths', '/', 'parameters', 0, 'schema']].sort()
      );
    });
    it(`should find path parameter content schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            parameters: [{ content: { 'application/json': { schema: {} } } }],
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'parameters',
            0,
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response header schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  headers: {
                    Foo: {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'headers',
            'Foo',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response header content schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  headers: {
                    Foo: {
                      content: {
                        'application/json': {
                          schema: {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'headers',
            'Foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find request body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {},
                  },
                  'application/xml': {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(collections.schemas, doc);

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                    'application/xml': {
                      schema: {},
                    },
                  },
                },
                '4xx': {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                    'application/xml': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.responseSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'content',
            'application/xml',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '4xx',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'responses',
            '4xx',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
  });

  describe('securitySchemes', () => {
    it(`should find security schemes`, async () => {
      const doc = {
        components: {
          securitySchemes: {
            foo: {},
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.securitySchemes,
        doc
      );

      expect(visitedPaths).toEqual([['components', 'securitySchemes', 'foo']]);
    });
  });

  describe('unresolvedRequestBodySchemas', () => {
    it(`should find request body schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {},
                  },
                  'application/xml': {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedRequestBodySchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find request body schemas in components`, async () => {
      const doc = {
        components: {
          requestBodies: {
            foo: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedRequestBodySchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'requestBodies',
            'foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
  });

  describe('unresolvedResponseSchemas', () => {
    it(`should find response body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedResponseSchemas,
        doc
      );

      expect(visitedPaths).toEqual([
        [
          'paths',
          '/',
          'post',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
        ],
      ]);
    });
    it(`should find response body schemas in components`, async () => {
      const doc = {
        components: {
          responses: {
            foo: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedResponseSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'responses',
            'foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
  });

  describe('unresolvedSchemas', () => {
    it(`should find parameter schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              parameters: [{ schema: {} }],
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['paths', '/', 'post', 'parameters', 0, 'schema']].sort()
      );
    });
    it(`should find parameter content schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              parameters: [{ content: { 'application/json': { schema: {} } } }],
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'parameters',
            0,
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find parameter schemas in paths`, async () => {
      const doc = {
        paths: {
          '/': {
            parameters: [{ schema: {} }],
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['paths', '/', 'parameters', 0, 'schema']].sort()
      );
    });
    it(`should find parameter content schemas in paths`, async () => {
      const doc = {
        paths: {
          '/': {
            parameters: [{ content: { 'application/json': { schema: {} } } }],
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'parameters',
            0,
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find parameter schemas in components`, async () => {
      const doc = {
        components: {
          parameters: {
            foo: { schema: {} },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['components', 'parameters', 'foo', 'schema']].sort()
      );
    });
    it(`should find parameter content schemas in components`, async () => {
      const doc = {
        components: {
          parameters: {
            foo: { content: { 'application/json': { schema: {} } } },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'parameters',
            'foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response header schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  headers: {
                    Foo: {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'headers',
            'Foo',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response header content schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  headers: {
                    Foo: {
                      content: {
                        'application/json': {
                          schema: {},
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'responses',
            '200',
            'headers',
            'Foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find header schemas in components`, async () => {
      const doc = {
        components: {
          headers: {
            Foo: {
              schema: {},
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['components', 'headers', 'Foo', 'schema']].sort()
      );
    });
    it(`should find header content schemas in components`, async () => {
      const doc = {
        components: {
          headers: {
            Foo: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'headers',
            'Foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response header schemas in components`, async () => {
      const doc = {
        components: {
          responses: {
            foo: {
              headers: {
                Foo: {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['components', 'responses', 'foo', 'headers', 'Foo', 'schema']].sort()
      );
    });
    it(`should find response header content schemas in components`, async () => {
      const doc = {
        components: {
          responses: {
            foo: {
              headers: {
                Foo: {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'responses',
            'foo',
            'headers',
            'Foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find request body schemas in operations`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {},
                  },
                  'application/xml': {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/json',
            'schema',
          ],
          [
            'paths',
            '/',
            'post',
            'requestBody',
            'content',
            'application/xml',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find request body schemas in components`, async () => {
      const doc = {
        components: {
          requestBodies: {
            foo: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'requestBodies',
            'foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find response body schemas`, async () => {
      const doc = {
        paths: {
          '/': {
            post: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths).toEqual([
        [
          'paths',
          '/',
          'post',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
        ],
      ]);
    });
    it(`should find response body schemas in components`, async () => {
      const doc = {
        components: {
          responses: {
            foo: {
              content: {
                'application/json': {
                  schema: {},
                },
              },
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [
          [
            'components',
            'responses',
            'foo',
            'content',
            'application/json',
            'schema',
          ],
        ].sort()
      );
    });
    it(`should find schemas in components`, async () => {
      const doc = {
        components: {
          schemas: {
            Foo: {
              schema: {},
            },
          },
        },
      };

      const visitedPaths = await testRulePaths(
        collections.unresolvedSchemas,
        doc
      );

      expect(visitedPaths.sort()).toEqual(
        [['components', 'schemas', 'Foo']].sort()
      );
    });
  });
});
