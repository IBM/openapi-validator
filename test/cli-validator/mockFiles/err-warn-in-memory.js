module.exports = {
  swagger: '2.0',
  info: {
    description:
      'This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
    version: '1.0.0',
    title: 'Swagger Petstore',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'apiteam@swagger.io',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  host: 'petstore.swagger.io',
  basePath: '/v2',
  tags: [
    {
      name: 'pet',
      description: 'Everything about your Pets',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io',
      },
    },
    {
      name: 'store',
      description: 'Access to Petstore orders',
    },
    {
      name: 'user',
      description: 'Operations about user',
      externalDocs: {
        description: 'Find out more about our store',
        url: 'http://swagger.io',
      },
    },
  ],
  schemes: ['http'],
  paths: {
    '/pet': {
      post: {
        tags: ['pet'],
        summary: 'Add a new pet to the store',
        description: 'post a pet to store',
        operationId: ' ',
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: {
              $ref: '#/definitions/Pet',
            },
          },
        ],
        responses: {
          405: {
            description: 'Invalid input',
          },
        },
        security: [
          {
            petstore_auth: ['write:pets', 'read:pets'],
          },
        ],
      },
      put: {
        tags: ['pet'],
        summary: 'Update an existing pet',
        description: 'put new data for existing pet',
        operationId: ' ',
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: {
              $ref: '#/definitions/Pet',
            },
          },
        ],
        responses: {
          400: {
            description: 'Invalid ID supplied',
          },
          404: {
            description: 'Pet not found',
          },
          405: {
            description: 'Validation exception',
          },
        },
        security: [
          {
            petstore_auth: ['write:pets', 'read:pets'],
          },
        ],
      },
    },
    '/pet/find_by_status': {
      get: {
        tags: ['pet'],
        summary: 'Finds Pets by status',
        description:
          'Multiple status values can be provided with comma separated strings',
        operationId: 'findPetsByStatus',
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Status values that need to be considered for filter',
            required: true,
            type: 'array',
            items: {
              type: 'string',
              enum: ['available', 'pending', 'sold'],
              default: 'available',
            },
            collectionFormat: 'multi',
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Pet',
              },
            },
          },
          400: {
            description: 'Invalid status value',
          },
        },
        security: [
          {
            petstore_auth: ['write:pets', 'read:pets'],
          },
        ],
      },
    },
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
      flow: 'implicit',
      scopes: {
        'write:pets': 'modify pets in your account',
        'read:pets': 'read your pets',
      },
    },
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
  definitions: {
    Category: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          format: 'int64',
        },
        name: {
          type: 'string',
          description: 'string',
        },
      },
      xml: {
        name: 'Category',
      },
    },
    Tag: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          format: 'int64',
          description: 'string',
        },
        name: {
          type: 'string',
          description: 'string',
        },
      },
      xml: {
        name: 'Tag',
      },
    },
    Pet: {
      type: 'object',
      required: ['name', 'photoUrls'],
      properties: {
        id: {
          type: 'integer',
          format: 'int64',
          description: 'string',
        },
        category: {
          $ref: '#/definitions/Category',
        },
        name: {
          type: 'string',
          example: 'doggie',
          description: 'string',
        },
        photoUrls: {
          type: 'array',
          description: 'string',
          xml: {
            name: 'photoUrl',
            wrapped: true,
          },
          items: {
            type: 'string',
          },
        },
        tags: {
          type: 'array',
          description: 'string',
          xml: {
            name: 'tag',
            wrapped: true,
          },
          items: {
            $ref: '#/definitions/Tag',
          },
        },
        status: {
          type: 'string',
          description: 'pet status in the store',
          enum: ['available', 'pending', 'sold'],
        },
      },
      xml: {
        name: 'Pet',
      },
    },
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};
