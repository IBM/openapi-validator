module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'some title with <script>alert("You are Hacked");</script> eval('
  },
  paths: {
    '/pet': {
      post: {
        summary: 'Add a new pet to the store',
        operationId: 'add_pet',
        tags: ['pets'],
        requestBody: {
          description: 'Pet object that needs to be added to the store',
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } }
        },
        responses: {
          '204': { description: 'Success' },
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      },
      put: {
        summary: 'Update an existing pet',
        description: 'put new data for existing pet',
        operationId: 'update_pet',
        requestBody: {
          description: 'Pet object that needs to be added to the store',
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } }
        },
        responses: {
          '204': { description: 'Success' },
          '400': { description: 'Invalid ID supplied' },
          '404': { description: 'Pet not found' },
          '405': { description: 'Validation exception' },
          default: { description: 'Error' }
        }
      }
    },
    '/given/another/': {
      post: {
        summary: 'bad path',
        operationId: 'trailing_slash',
        tags: ['pets'],
        requestBody: {
          description: 'Pet object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TheBadModel' }
            }
          }
        },
        responses: {
          '204': { description: 'Success' },
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    },
    '/path1': {
      post: {
        summary: 'bad examples values',
        operationId: 'bad_examples_values',
        tags: ['pets'],
        requestBody: {
          description: 'Pet object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              examples: {
                foo: {
                  summary: 'A foo example',
                  value: { foo: 'bar' },
                  externalValue: 'http://example.org/foo.json'
                }
              }
            }
          }
        },
        responses: {
          '204': { description: 'Success' },
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    },
    '/path2': {
      post: {
        summary: 'operation with a bad schema example',
        operationId: 'bad_schema_example',
        tags: ['pets'],
        requestBody: {
          description: 'Pet object that needs to be added to the store',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ModelWithBadExample' }
            }
          }
        },
        responses: {
          '204': { description: 'Success' },
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    }
  },
  components: {
    schemas: {
      ModelWithBadExample: {
        type: 'object',
        description: 'A bad example model',
        properties: {
          number_of_coins: {
            type: 'integer',
            description: 'The number of extension points.'
          }
        },
        example: { number_of_coins: 'testString' }
      },
      TheBadModel: {
        type: 'object',
        description: 'The bad model',
        properties: {
          number_of_connectors: {
            type: 'integer',
            description: 'The number of extension points.',
            enum: [1, 2, 'a_string', 8]
          }
        }
      }
    }
  }
};
