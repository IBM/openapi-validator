/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Root Test Definition',
    description: 'API definition for testing custom Spectral rules.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://some-madeup-url.com/api',
    },
  ],
  security: [
    {
      IAM: [],
    },
    {
      OpenIdScheme: ['openid:admin'],
    },
  ],
  tags: [
    {
      name: 'TestTag',
      description: 'A tag used for testing.',
    },
  ],
  paths: {
    '/v1/drinks': {
      post: {
        operationId: 'create_drink',
        summary: 'Create a drink',
        description: 'Create a new Drink instance.',
        tags: ['TestTag'],
        security: [
          {
            DrinkScheme: ['mixologist'],
          },
        ],
        'x-codegen-request-body-name': 'drink',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DrinkPrototype',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
          400: {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
        },
      },
      get: {
        operationId: 'list_drinks',
        summary: 'List drinks',
        description: 'Retrieve all the drinks.',
        tags: ['TestTag'],
        security: [
          {
            Basic: [],
            DrinkScheme: ['drinker'],
          },
        ],
        parameters: [
          {
            name: 'start',
            in: 'query',
            description: 'A token which indicates the first item to return.',
            required: false,
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9 ]+$',
              minLength: 1,
              maxLength: 128,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'The number of items to return per page.',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DrinkCollection',
                },
              },
            },
          },
          400: {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
        },
      },
    },
    '/v1/drinks/{drink_id}': {
      parameters: [
        {
          $ref: '#/components/parameters/DrinkIdParam',
        },
      ],
      get: {
        operationId: 'get_drink',
        summary: 'Have a drink',
        description: 'Retrieve and consume a refreshing beverage.',
        tags: ['TestTag'],
        security: [
          {
            DrinkScheme: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/VerboseParam',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/ConsumedDrink',
          },
          400: {
            $ref: '#/components/responses/BarIsClosed',
          },
        },
      },
    },
    '/v1/drink_menu': {
      get: {
        operationId: 'download_drink_menu',
        summary: 'Download Drinks Menu',
        description: 'Retrieve a document containing the drinks menu.',
        tags: ['TestTag'],
        responses: {
          200: {
            content: {
              'application/octet-stream': {
                schema: {
                  description: 'Document file contents',
                  type: 'string',
                  format: 'binary',
                  minLength: 0,
                  maxLength: 1024000,
                },
              },
            },
          },
        },
      },
      put: {
        operationId: 'replace_drink_menu',
        summary: 'Upload Drinks Menu',
        description: 'Publish a new Drinks Menu for public viewing.',
        tags: ['TestTag'],
        'x-codegen-request-body-name': 'document',
        parameters: [
          {
            in: 'query',
            name: 'document_name',
            description: 'The document name as a string.',
            schema: {
              description: 'Name of the file as a string',
              type: 'string',
              pattern: '^[a-z0-9]*.pdf$',
              minLength: 0,
              maxLength: 1024000,
            },
          },
          {
            in: 'query',
            name: 'document_type',
            description: 'The document type as a string.',
            content: {
              'application/json': {
                schema: {
                  description: 'valid document types',
                  type: 'string',
                  enum: ['pdf', 'odt', 'doc'],
                },
              },
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/octet-stream': {
              schema: {
                description: 'The document contents.',
                type: 'string',
                format: 'binary',
                minLength: 0,
                maxLength: 1024000,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Upload confirmed!',
            content: {
              'text/plain': {
                schema: {
                  description: 'String response for upload request.',
                  type: 'string',
                  minLength: 0,
                  maxLength: 512,
                  pattern: '^[a-zA-Z0-9 ]+$',
                },
              },
            },
          },
        },
      },
    },
    '/v1/movies': {
      post: {
        operationId: 'create_movie',
        summary: 'Create a movie',
        description: 'Create a new Movie instance.',
        tags: ['TestTag'],
        security: [
          {
            MovieScheme: ['director'],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MoviePrototype',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Movie',
                },
              },
            },
          },
          400: {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
        },
      },
      get: {
        operationId: 'list_movies',
        summary: 'List movies',
        description:
          'Retrieve a list of movies using an optional genre qualifier.',
        tags: ['TestTag'],
        security: [
          {
            MovieScheme: ['moviegoer'],
          },
        ],
        parameters: [
          {
            description: 'An optional genre to filter on.',
            name: 'genre',
            required: false,
            in: 'query',
            schema: {
              type: 'string',
              enum: ['comedy', 'drama', 'action', 'musical', 'documentary'],
            },
          },
          {
            name: 'start',
            in: 'query',
            description: 'A token which indicates the first item to return.',
            required: false,
            schema: {
              type: 'string',
              pattern: '^[a-zA-Z0-9 ]+$',
              minLength: 1,
              maxLength: 128,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'The number of items to return per page.',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MovieCollection',
                },
                example: {
                  limit: 2,
                  total_count: 2,
                  first: {
                    href: 'first page',
                  },
                  last: {
                    href: 'last page',
                  },
                  movies: [
                    { id: '1234', name: 'The Fellowship of the Ring' },
                    { id: '5678', name: 'The Two Towers' },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/v1/movies/{movie_id}': {
      parameters: [
        {
          $ref: '#/components/parameters/MovieIdParam',
        },
      ],
      get: {
        operationId: 'get_movie',
        summary: 'Get a movie',
        description: 'Retrieve the movie and return it in the response.',
        tags: ['TestTag'],
        security: [
          {
            MovieScheme: ['moviegoer'],
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/MovieWithETag',
          },
          400: {
            description: 'Didnt work!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
        },
      },
      put: {
        operationId: 'replace_movie',
        summary: 'Replace movie',
        description: 'Replace a movie with updated state information.',
        tags: ['TestTag'],
        parameters: [
          {
            $ref: '#/components/parameters/IfMatchParam',
          },
        ],
        security: [
          {
            MovieScheme: ['director'],
          },
        ],
        'x-codegen-request-body-name': 'movie',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MoviePrototype',
              },
            },
          },
        },
        responses: {
          200: {
            $ref: '#/components/responses/MovieWithETag',
          },
          400: {
            description: 'Didnt work!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
          409: {
            description: 'Resource conflict!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainer',
                },
              },
            },
          },
        },
      },
    },
    '/v1/cars': {
      post: {
        operationId: 'create_car',
        summary: 'Create a car',
        description: 'Create a new Car instance.',
        tags: ['TestTag'],
        parameters: [
          {
            $ref: '#/components/parameters/ExpediteParam',
          },
        ],
        security: [
          {
            IAM: [],
          },
        ],
        'x-codegen-request-body-name': 'car',
        requestBody: {
          $ref: '#/components/requestBodies/CarRequest',
        },
        responses: {
          201: {
            description: 'The car instance was returned in the response.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Car',
                },
                examples: {
                  ResponseExample: {
                    $ref: '#/components/examples/CarExample',
                  },
                },
              },
            },
            links: {
              CarId: {
                $ref: '#/components/links/CarIdLink',
              },
            },
          },
          400: {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
    },
    '/v1/cars/{car_id}': {
      parameters: [
        {
          $ref: '#/components/parameters/CarIdParam',
        },
      ],
      get: {
        operationId: 'get_car',
        summary: 'Get Car',
        description: 'Retrieve a Car instance by its id.',
        tags: ['TestTag'],
        security: [
          {
            IAM: [],
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/CarResponse',
          },
          400: {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
      patch: {
        operationId: 'update_car',
        summary: 'Update a car',
        description: 'Update a new Car instance with new state information.',
        tags: ['TestTag'],
        security: [
          {
            IAM: [],
          },
        ],
        requestBody: {
          $ref: '#/components/requestBodies/UpdateCarRequest',
        },
        responses: {
          200: {
            description: 'The car instance was updated successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Car',
                },
                examples: {
                  ResponseExample: {
                    $ref: '#/components/examples/CarExample',
                  },
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      DrinkIdParam: {
        name: 'drink_id',
        description: 'The id of the drink resource.',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[a-zA-Z0-9 ]+$',
          minLength: 1,
          maxLength: 30,
        },
      },
      MovieIdParam: {
        name: 'movie_id',
        description: 'The id of the movie resource.',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[a-zA-Z0-9 ]+$',
          minLength: 1,
          maxLength: 30,
        },
      },
      VerboseParam: {
        description: 'An optional verbose parameter.',
        name: 'verbose',
        required: false,
        in: 'query',
        schema: {
          type: 'boolean',
        },
      },
      ExpediteParam: {
        description:
          'An optional parameter to speed up the car manufacturing process.',
        name: 'hurry_up',
        required: false,
        in: 'query',
        schema: {
          type: 'boolean',
        },
      },
      CarIdParam: {
        description: 'A car id.',
        name: 'car_id',
        required: true,
        in: 'path',
        schema: {
          type: 'string',
          pattern: '^[a-zA-Z0-9 ]+$',
          minLength: 1,
          maxLength: 30,
        },
      },
      IfMatchParam: {
        description: 'The If-Match header param.',
        name: 'If-Match',
        required: true,
        in: 'header',
        schema: {
          type: 'string',
          pattern: '^[a-zA-Z0-9 ]+$',
          minLength: 1,
          maxLength: 64,
        },
      },
    },
    schemas: {
      Movie: {
        description: 'This is the Movie schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
          director: {
            $ref: '#/components/schemas/NormalString',
          },
          running_time: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
            maximum: 360,
            description: 'The length of the movie, in minutes.',
          },
          imdb_url: {
            $ref: '#/components/schemas/UrlString',
          },
          trailer: {
            type: 'string',
            format: 'byte',
            description: 'A short trailer for the movie.',
            minLength: 0,
            maxLength: 1024,
          },
        },
        example: {
          id: 'acb123',
          name: 'The Two Towers',
          director: 'Peter Jackson',
          running_time: 179,
        },
      },
      MoviePrototype: {
        description: 'This is the Movie creation schema.',
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            $ref: '#/components/schemas/NormalString',
          },
          director: {
            $ref: '#/components/schemas/NormalString',
          },
          running_time: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
            maximum: 360,
            description: 'The length of the movie, in minutes.',
          },
          imdb_url: {
            $ref: '#/components/schemas/UrlString',
          },
          trailer: {
            type: 'string',
            format: 'byte',
            description: 'A short trailer for the movie.',
            minLength: 0,
            maxLength: 1024,
          },
        },
        example: {
          name: 'The Two Towers',
          director: 'Peter Jackson',
          running_time: 179,
        },
      },
      Drink: {
        type: 'object',
        description:
          'A Drink can be either a Juice or Soda instance. Sorry, no Beer or Whisky allowed.',
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
        },
        oneOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
          {
            $ref: '#/components/schemas/Soda',
          },
        ],
        discriminator: {
          propertyName: 'type',
        },
        example: {
          id: 'acb123',
          type: 'soda',
          name: 'Root Beer',
        },
      },
      DrinkPrototype: {
        type: 'object',
        description:
          'A Drink can be either a Juice or Soda instance. Sorry, no Beer or Whisky allowed.',
        oneOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
          {
            $ref: '#/components/schemas/Soda',
          },
        ],
        discriminator: {
          propertyName: 'type',
        },
        example: {
          type: 'soda',
          name: 'Root Beer',
        },
      },
      Soda: {
        description: 'Do you really not know what a Soda is?',
        type: 'object',
        required: ['type', 'name'],
        properties: {
          type: {
            description: 'The drink type - should be "soda".',
            type: 'string',
            enum: ['soda'],
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      },
      Juice: {
        description: 'Juice box!',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      },
      NormalString: {
        description: 'This is a normal string.',
        type: 'string',
        pattern: '^[a-zA-Z0-9 ]+$',
        minLength: 1,
        maxLength: 30,
      },
      IdString: {
        description: 'An identifier of some sort.',
        type: 'string',
        readOnly: true,
        pattern: '^[a-zA-Z0-9]+$',
        minLength: 1,
        maxLength: 10,
      },
      UrlString: {
        description: 'A URL of some sort.',
        type: 'string',
        format: 'url',
        pattern: '^https://.*$',
        maxLength: 1024,
      },
      DrinkCollection: {
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
        ],
        example: {
          limit: 1,
          total_count: 1,
          first: {
            href: 'first page',
          },
          next: {
            href: 'next page',
          },
          previous: {
            href: 'previous page',
          },
          last: {
            href: 'last page',
          },
          drinks: [
            {
              type: 'soda',
              name: 'Root Beer',
            },
          ],
        },
      },
      MovieCollection: {
        type: 'object',
        description: 'A single page of results containing Movie instances.',
        allOf: [
          {
            $ref: '#/components/schemas/TokenPaginationBase',
          },
          {
            type: 'object',
            required: ['movies'],
            properties: {
              movies: {
                description:
                  'The set of Movie instances in this page of results.',
                type: 'array',
                minItems: 0,
                maxItems: 50,
                items: {
                  $ref: '#/components/schemas/Movie',
                },
              },
            },
          },
        ],
        example: {
          limit: 1,
          total_count: 1,
          first: {
            href: 'first page',
          },
          next: {
            href: 'next page',
          },
          previous: {
            href: 'previous page',
          },
          last: {
            href: 'last page',
          },
          movies: [
            {
              id: 'acb123',
              name: 'The Two Towers',
              director: 'Peter Jackson',
              running_time: 179,
            },
          ],
        },
      },
      Car: {
        description: 'Information about a car.',
        type: 'object',
        required: ['id', 'make', 'model'],
        properties: {
          id: {
            description: 'The car id.',
            type: 'string',
            minLength: 1,
            maxLength: 64,
            pattern: '^[0-9]+$',
          },
          make: {
            description: 'The car make.',
            type: 'string',
            minLength: 1,
            maxLength: 32,
            pattern: '^.*$',
          },
          model: {
            $ref: '#/components/schemas/CarModelType',
          },
        },
      },
      CarPrototype: {
        description: 'Information about a car.',
        type: 'object',
        required: ['make', 'model'],
        properties: {
          make: {
            description: 'The car make.',
            type: 'string',
            minLength: 1,
            maxLength: 32,
            pattern: '^.*$',
          },
          model: {
            $ref: '#/components/schemas/CarModelType',
          },
        },
      },
      CarPatch: {
        description: 'Information about a car.',
        type: 'object',
        properties: {
          make: {
            description: 'The car make.',
            type: 'string',
            minLength: 1,
            maxLength: 32,
            pattern: '^.*$',
          },
          model: {
            $ref: '#/components/schemas/CarModelType',
          },
        },
      },
      CarModelType: {
        description: 'The car model.',
        type: 'string',
        minLength: 1,
        maxLength: 32,
        pattern: '^.*$',
      },
      TokenPaginationBase: {
        description:
          'A base schema containing properties that support token-based pagination.',
        type: 'object',
        required: ['limit', 'total_count'],
        properties: {
          limit: {
            description:
              'The number of items returned in this page of results.',
            type: 'integer',
            format: 'int32',
            minimum: 1,
            maximum: 100,
          },
          total_count: {
            description: 'The total number of items across all result pages.',
            type: 'integer',
            format: 'int32',
            minimum: 0,
            maximum: 1024,
          },
          first: {
            $ref: '#/components/schemas/PageLink',
          },
          next: {
            $ref: '#/components/schemas/PageLink',
          },
          previous: {
            $ref: '#/components/schemas/PageLink',
          },
          last: {
            allOf: [
              {
                $ref: '#/components/schemas/PageLink',
              },
              {
                description: 'Link to the last page of results.',
              },
            ],
          },
        },
      },
      PageLink: {
        description: 'Contains a link to a page of paginated results',
        type: 'object',
        properties: {
          href: {
            description: 'The link value',
            type: 'string',
            pattern: '^[a-zA-Z0-9 ]+$',
            minLength: 1,
            maxLength: 30,
          },
        },
      },
      ErrorContainer: {
        description: 'An error response for an operation.',
        type: 'object',
        required: ['errors'],
        properties: {
          errors: {
            type: 'array',
            minItems: 0,
            maxItems: 100,
            description:
              'The array of error entries associated with the error response',
            items: {
              $ref: '#/components/schemas/Error',
            },
          },
          status_code: {
            type: 'integer',
            format: 'int32',
            minimum: 0,
            maximum: 599,
            description: 'The HTTP status code.',
          },
          trace: {
            description: 'The error trace information.',
            type: 'string',
            format: 'identifier',
            pattern: '^[a-zA-Z0-9 ]+$',
            maxLength: 30,
          },
        },
      },
      Error: {
        description: 'An error response entry.',
        type: 'object',
        required: ['code'],
        properties: {
          code: {
            description: 'The error code.',
            type: 'string',
            enum: ['bad_request', 'not_authorized', 'no_need_to_know'],
          },
          message: {
            description: 'The error message.',
            type: 'string',
            pattern: '^[a-zA-Z0-9 ]+$',
            minLength: 1,
            maxLength: 128,
          },
          more_info: {
            description: 'Additional info about the error.',
            type: 'string',
            pattern: '^[a-zA-Z0-9 ]+$',
            minLength: 1,
            maxLength: 128,
          },
          target: {
            $ref: '#/components/schemas/ErrorTarget',
          },
        },
      },
      ErrorTarget: {
        description: 'An error target (a field, header or query parameter).',
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            description: 'The error target type.',
            type: 'string',
            enum: ['field', 'header', 'parameter'],
          },
          name: {
            description:
              'The name of the field/header/query parameter associated with the error.',
            type: 'string',
            pattern: '^[a-zA-Z0-9 ]+$',
            minLength: 1,
            maxLength: 30,
          },
        },
      },
    },
    securitySchemes: {
      IAM: {
        type: 'apiKey',
        description:
          'An IAM access token provided via the Authorization header',
        in: 'header',
        name: 'Authorization',
      },
      Basic: {
        type: 'http',
        description: 'A basic-auth type Authorization header',
        scheme: 'Basic',
        bearerFormat: 'bearer',
      },
      DrinkScheme: {
        type: 'oauth2',
        description: 'An oauth2 authorizaton flow',
        flows: {
          implicit: {
            authorizationUrl: 'https://myoauthserver.com/auth',
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              mixologist: 'Can create Drinks',
              drinker: 'Can consume beverages',
            },
          },
          authorizationCode: {
            authorizationUrl: 'https://myoauthserver.com/auth',
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              mixologist: 'Can create Drinks',
            },
          },
        },
      },
      MovieScheme: {
        type: 'oauth2',
        description: 'An oauth2 authorizaton flow',
        flows: {
          implicit: {
            authorizationUrl: 'https://myoauthserver.com/auth',
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              director: 'Can create Movies',
              moviegoer: 'Can view Movies',
            },
          },
          authorizationCode: {
            authorizationUrl: 'https://myoauthserver.com/auth',
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              director: 'Can create Movies',
            },
          },
          clientCredentials: {
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              moviegoer: 'Can view Movies',
            },
          },
          password: {
            tokenUrl: 'https://myoauthserver.com/token',
            scopes: {
              moviegoer: 'Can view Movies',
            },
          },
        },
      },
      OpenIdScheme: {
        type: 'openIdConnect',
        description: 'An openid-connect authorization scheme',
        openIdConnectUrl: 'https://myopenidserver.com/auth',
      },
    },
    responses: {
      ConsumedDrink: {
        description: 'Success, we consumed a drink!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Drink',
            },
          },
        },
      },
      MovieWithETag: {
        description: 'Success, we retrieved a movie!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Movie',
            },
          },
        },
        headers: {
          ETag: {
            description: 'The unique version identifier of the movie.',
            schema: {
              $ref: '#/components/schemas/IdString',
            },
          },
        },
      },
      BarIsClosed: {
        description: 'Error, no drinks to be had!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorContainer',
            },
          },
        },
      },
      CarResponse: {
        description: 'The car instance was returned in the response.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Car',
            },
            examples: {
              ResponseExample: {
                $ref: '#/components/examples/CarExample',
              },
            },
          },
        },
      },
      ErrorResponse: {
        description: 'An error occurred.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorContainer',
            },
          },
        },
      },
    },
    requestBodies: {
      CarRequest: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CarPrototype',
            },
            examples: {
              RequestExample: {
                $ref: '#/components/examples/CarExample',
              },
            },
          },
        },
      },
      UpdateCarRequest: {
        required: true,
        content: {
          'application/merge-patch+json; charset=utf-8': {
            schema: {
              $ref: '#/components/schemas/CarPatch',
            },
            examples: {
              RequestExample: {
                $ref: '#/components/examples/CarExample',
              },
            },
          },
        },
      },
    },
    examples: {
      CarExample: {
        description: 'An example of a Car instance.',
        value: {
          id: '1',
          make: 'Ford',
          model: 'F150 Lariat',
        },
      },
    },
    links: {
      CarIdLink: {
        description:
          'Link the `create_car` response `id` property to the `get_car` path parameter named `car_id`.',
        operationId: 'get_car',
        parameters: {
          car_id: '$response.body#/id',
        },
      },
    },
    callbacks: {},
    headers: {},
  },
};
