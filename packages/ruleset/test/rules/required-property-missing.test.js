/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requiredPropertyMissing } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-define-required-properties';
const rule = requiredPropertyMissing;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error with properly defined allOf, anyOf, and oneOf schemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      bar: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                  ],
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

  it('should not error if not schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  not: {
                    type: 'object',
                    required: ['foo'],
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if "required" in separate allOf element', async () => {
    const testDocument = makeCopy(rootDocument);

    testDocument.components.schemas['DrinkCollection'] = {
      type: 'object',
      description: 'A single page of results containing Drink instances.',
      allOf: [
        {
          $ref: '#/components/schemas/TokenPaginationBase',
        },
        {
          type: 'object',
          required: ['drinks'],
          properties: {
            drinks: {
              description:
                'The set of Drink instances in this page of results.',
              type: 'array',
              minItems: 0,
              maxItems: 50,
              items: {
                $ref: '#/components/schemas/Drink',
              },
            },
          },
        },
        {
          // The "first" property is defined in TokenPaginationBase.
          required: ['first'],
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if allOf schema is missing a required property ("required" in main schema)', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.parameters.0.content.application/json.schema.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if allOf schema is missing a required property ("required" in allOf element)', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  allOf: [
                    {
                      type: 'object',
                      required: ['baz'],
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      required: ['bar'],
                      properties: {
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      required: ['foo'],
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.parameters.0.content.application/json.schema.allOf.2.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if anyOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      bar: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.requestBody.content.application/json.schema.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if oneOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.responses.201.content.application/json.schema.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if nested oneOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      oneOf: [
                        {
                          type: 'object',
                          properties: {
                            foo: {
                              type: 'string',
                            },
                            baz: {
                              type: 'string',
                            },
                          },
                        },
                        {
                          type: 'object',
                          properties: {
                            bat: {
                              type: 'string',
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.responses.201.content.application/json.schema.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if anyOf list element schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      bar: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                    required: ['foo'],
                  },
                ],
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.requestBody.content.application/json.schema.anyOf.1.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if oneOf list element schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                      required: ['foo'],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in the schema: foo'
    );
    expect(validation.path.join('.')).toBe(
      'paths.v1/books.post.responses.201.content.application/json.schema.oneOf.1.required'
    );
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error for schemas that are missing definitions for required properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  properties: {},
                },
              },
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                properties: {},
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  properties: {},
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(3);

    results.forEach(r => {
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(
        'Required property must be defined in the schema: foo'
      );
      expect(r.severity).toBe(severityCodes.error);
    });

    expect(results[0].path.join('.')).toBe(
      'paths.v1/books.post.parameters.0.content.application/json.schema.required'
    );
    expect(results[1].path.join('.')).toBe(
      'paths.v1/books.post.requestBody.content.application/json.schema.required'
    );
    expect(results[2].path.join('.')).toBe(
      'paths.v1/books.post.responses.201.content.application/json.schema.required'
    );
  });
});
