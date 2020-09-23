module.exports = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'Swagger Petstore' },
  servers: [{ url: 'http://petstore.swagger.io/v1' }],
  tags: [
    { name: 'pets', description: 'A pet' },
    { name: 'animal', description: 'Everything about your Pets' }
  ],
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        description: 'List all pets',
        operationId: 'list_pets',
        tags: ['pets'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'How many items to return at one time (max 100)',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              default: 10,
              maximum: 100
            }
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Offset of first element to return in results.',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': {
            description: 'An paged array of pets',
            headers: {
              'x-next': {
                description: 'A link to the next page of responses',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pets' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a pet',
        description: 'Create a pet',
        tags: ['pets'],
        responses: {
          '204': { description: 'Null response' },
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update a pet',
        description: 'Update a pet',
        tags: ['pets'],
        responses: {
          '405': { description: 'Invalid input' },
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/anotherpet/path?query=true': {
      get: {
        summary: 'List all pets',
        description: 'List all pets',
        operationId: 'list_pets',
        tags: ['pets'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'How many items to return at one time (max 100)',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              default: 10,
              maximum: 100
            }
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Offset of first element to return in results.',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': {
            description: 'An paged array of pets',
            headers: {
              'x-next': {
                description: 'A link to the next page of responses',
                schema: { type: 'string' }
              }
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pets' }
              }
            }
          },
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/pets/{pet_id}': {
      get: {
        summary: 'Info for a specific pet',
        description: 'Get information about a specific pet',
        operationId: 'get pet by id',
        tags: ['pets'],
        parameters: [
          {
            name: 'pet_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'pet_id',
            in: 'path',
            required: true,
            description: 'The id of the pet to retrieve',
            schema: { type: 'string' }
          }
        ],
        security: [{ apikey: [] }],
        responses: {
          '200': {
            description: 'Expected response to a valid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pets' }
              }
            }
          },
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/given/{}': {
      post: {
        summary: 'bad path',
        description: 'Invalid path',
        operationId: 'update_path',
        tags: ['pets'],
        parameters: [
          {
            name: 'incorrect_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'module_id',
            in: 'bar',
            required: true,
            schema: { type: ['string', 'number'] }
          }
        ],
        responses: {
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    }
  },
  components: {
    schemas: {
      Sibling: {
        $ref: '#/components/schemas/Pet',
        examples: { an_example: { name: 'something' } }
      },
      Pet: {
        description: 'A pet',
        required: ['id', 'name'],
        properties: {
          id: { type: 'integer', format: 'int64', description: 'id property' },
          name: { type: 'string', description: 'name property' },
          tag: { type: 'string', description: 'tag property' }
        }
      },
      Pets: {
        description: 'A list of pets',
        required: ['pets', 'next_url', 'limit', 'offset'],
        properties: {
          pets: {
            type: 'array',
            description: 'object containing a list of pets',
            items: { $ref: '#/components/schemas/Pet' }
          },
          next_url: {
            type: 'string',
            description: 'this is the url to next page'
          },
          limit: { type: 'integer', format: 'int32', description: 'limit' },
          offset: { type: 'integer', format: 'int32', description: 'offset' },
          next_token: { type: 'string', description: 'next token' }
        }
      },
      Error: {
        description: 'An error in processing a service request',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'integer',
            format: 'int32',
            description: 'code property'
          },
          message: { type: 'string', description: 'message property' }
        }
      }
    }
  }
};
