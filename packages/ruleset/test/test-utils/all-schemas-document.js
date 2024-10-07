/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  openapi: '3.0.2',
  info: {
    title: 'Subschema examples',
    description:
      'A collection of schemas with various kinds of subschemas for testing.',
    version: '0.0.1',
    contact: {
      email: 'example@example.com',
    },
  },
  tags: [
    {
      name: 'Index',
    },
  ],
  servers: [
    {
      url: '/api/v3',
    },
  ],
  paths: {
    '/schema': {
      get: {
        tags: ['Index'],
        summary: 'Get the index',
        description: 'Get the index.',
        operationId: 'get_index',
        responses: {
          200: {
            description: "Here's the index.",
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Index',
                },
              },
            },
          },
        },
      },
    },
    '/every_flavor': {
      get: {
        tags: ['Index'],
        summary: 'Get every flavor',
        description: 'Get every flavor.',
        operationId: 'get_every_flavor',
        responses: {
          200: {
            description: "Here's every flavor.",
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EveryFlavor',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Index: {
        type: 'object',
        properties: {
          schema_with_property_schema: {
            $ref: '#/components/schemas/SchemaWithPropertySchema',
          },
          schema_with_additional_properties_schema: {
            $ref: '#/components/schemas/SchemaWithAdditionalPropertiesSchema',
          },
          schema_with_items_schema: {
            $ref: '#/components/schemas/SchemaWithItemsSchema',
          },
          schema_with_all_of_schema: {
            $ref: '#/components/schemas/SchemaWithAllOfSchema',
          },
          schema_with_one_of_schema: {
            $ref: '#/components/schemas/SchemaWithOneOfSchema',
          },
          schema_with_any_of_schema: {
            $ref: '#/components/schemas/SchemaWithAnyOfSchema',
          },
          schema_with_not_schema: {
            $ref: '#/components/schemas/SchemaWithNotSchema',
          },
        },
      },
      EveryFlavor: {
        properties: {
          property_schema: {
            $ref: '#/components/schemas/SchemaWithPropertySchema',
          },
        },
        additionalProperties: {
          $ref: '#/components/schemas/AdditionalPropertiesSchema',
        },
        items: {
          $ref: '#/components/schemas/ItemsSchema',
        },
        allOf: [
          {
            $ref: '#/components/schemas/AllOfSchema',
          },
        ],
        oneOf: [
          {
            $ref: '#/components/schemas/OneOfSchema',
          },
        ],
        anyOf: [
          {
            $ref: '#/components/schemas/AnyOfSchema',
          },
        ],
        not: {
          $ref: '#/components/schemas/NotSchema',
        },
      },
      SchemaWithPropertySchema: {
        type: 'object',
        properties: {
          property_schema: {
            $ref: '#/components/schemas/PropertySchema',
          },
        },
      },
      PropertySchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithPropertySchema`.',
      },
      SchemaWithAdditionalPropertiesSchema: {
        type: 'object',
        additionalProperties: {
          $ref: '#/components/schemas/AdditionalPropertiesSchema',
        },
      },
      AdditionalPropertiesSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithAdditionalPropertiesSchema`.',
      },
      SchemaWithItemsSchema: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ItemsSchema',
        },
      },
      ItemsSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithItemsSchema`.',
      },
      SchemaWithAllOfSchema: {
        type: 'string',
        allOf: [
          {
            $ref: '#/components/schemas/AllOfSchema',
          },
        ],
      },
      AllOfSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithAllOfSchema`.',
      },
      SchemaWithOneOfSchema: {
        type: 'string',
        oneOf: [
          {
            $ref: '#/components/schemas/OneOfSchema',
          },
        ],
      },
      OneOfSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithOneOfSchema`.',
      },
      SchemaWithAnyOfSchema: {
        type: 'string',
        anyOf: [
          {
            $ref: '#/components/schemas/AnyOfSchema',
          },
        ],
      },
      AnyOfSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithAnyOfSchema`.',
      },
      SchemaWithNotSchema: {
        type: 'string',
        not: {
          $ref: '#/components/schemas/NotSchema',
        },
      },
      NotSchema: {
        type: 'string',
        description:
          'This schema is reachable from `EveryFlavor` and `SchemaWithNotSchema`.',
      },
    },
  },
};
