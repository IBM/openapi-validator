module.exports = {
  swagger: '2.0',
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
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { type: 'object' }
          }
        ],
        responses: {
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      },
      put: {
        summary: 'Update an existing pet',
        description: 'put new data for existing pet',
        operationId: 'update_pet',
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { type: 'object' }
          }
        ],
        responses: {
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
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { $ref: '#/definitions/TheBadModel' }
          }
        ],
        responses: {
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    },
    '/path1': {
      post: {
        summary: 'operation with a bad schema example',
        operationId: 'bad_example',
        tags: ['pets'],
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { $ref: '#/definitions/ModelWithBadExample' }
          }
        ],
        responses: {
          '405': { description: 'Invalid input' },
          default: { description: 'Invalid input' }
        }
      }
    },
    '/path2': {
      post: {
        summary: 'operation with anyOf keyword',
        operationId: 'incorrect_any_of_use',
        tags: ['pets'],
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { type: 'object' }
          }
        ],
        responses: {
          '200': {
            description: 'A paged array of pets',
            schema: { $ref: '#/definitions/ModelWithAnyOf' }
          },
          default: { description: 'Invalid input' }
        }
      }
    },
    '/path3': {
      post: {
        summary: 'operation with oneOf keyword',
        operationId: 'incorrect_one_of_use',
        tags: ['pets'],
        consumes: ['application/json', 'application/xml'],
        produces: ['application/xml', 'application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Pet object that needs to be added to the store',
            required: true,
            schema: { type: 'object' }
          }
        ],
        responses: {
          '200': {
            description: 'A paged array of pets',
            schema: { $ref: '#/definitions/ModelWithOneOf' }
          },
          default: { description: 'Invalid input' }
        }
      }
    }
  },
  definitions: {
    TheBadModel: {
      type: 'object',
      description: 'A bad model',
      properties: {
        number_of_connectors: {
          type: 'integer',
          description: 'The number of extension points.',
          enum: [1, 2, 'a_string', 8]
        }
      }
    },
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
    ModelWithAnyOf: {
      type: 'object',
      description: 'A bad model with anyOf',
      anyOf: [{ type: 'string' }, { type: 'integer' }]
    },
    ModelWithOneOf: {
      type: 'object',
      description: 'A bad model with oneOf',
      oneOf: [{ type: 'string' }, { type: 'integer' }]
    }
  }
};
