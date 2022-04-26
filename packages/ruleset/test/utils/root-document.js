module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Root Test Definition',
    description: 'API definition for testing custom Spectral rules.',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'https://some-madeup-url.com/api'
    }
  ],
  security: [
    {
      IAM: []
    },
    {
      OpenIdScheme: ['openid:admin']
    }
  ],
  tags: [
    {
      name: 'TestTag',
      description: 'A tag used for testing.'
    }
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
            DrinkScheme: ['mixologist']
          }
        ],
        'x-codegen-request-body-name': 'drink',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Drink'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Drink'
                }
              }
            }
          },
          '400': {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      get: {
        operationId: 'list_drinks',
        summary: 'List drinks',
        description: 'Retrieve all the drinks.',
        tags: ['TestTag'],
        security: [
          {
            Basic: [],
            DrinkScheme: ['drinker']
          }
        ],
        parameters: [
          {
            name: 'offset',
            in: 'query',
            description: 'The offset (origin 0) of the first item to return.',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 0
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'The number of items to return per page.',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              maximum: 100,
              default: 10
            }
          }
        ],
        responses: {
          '200': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DrinkCollection'
                }
              }
            }
          },
          '400': {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/v1/drinks/{drink_id}': {
      parameters: [
        {
          $ref: '#/components/parameters/DrinkIdParam'
        }
      ],
      get: {
        operationId: 'get_drink',
        summary: 'Have a drink',
        description: 'Retrieve and consume a refreshing beverage.',
        tags: ['TestTag'],
        security: [
          {
            DrinkScheme: []
          }
        ],
        parameters: [
          {
            $ref: '#/components/parameters/VerboseParam'
          }
        ],
        responses: {
          '200': {
            $ref: '#/components/responses/ConsumedDrink'
          },
          '400': {
            $ref: '#/components/responses/BarIsClosed'
          }
        }
      }
    },
    '/v1/movies': {
      post: {
        operationId: 'create_movie',
        summary: 'Create a movie',
        description: 'Create a new Movie instance.',
        tags: ['TestTag'],
        security: [
          {
            MovieScheme: ['director']
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Movie'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Movie'
                }
              }
            }
          },
          '400': {
            description: 'Error!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      get: {
        operationId: 'list_movies',
        summary: 'List movies',
        description:
          'Retrieve a list of movies using an optional genre qualifier.',
        tags: ['TestTag'],
        security: [
          {
            MovieScheme: ['moviegoer']
          }
        ],
        parameters: [
          {
            description: 'An optional genre to filter on.',
            name: 'genre',
            required: false,
            in: 'query',
            schema: {
              type: 'string',
              enum: ['comedy', 'drama', 'action', 'musical', 'documentary']
            }
          },
          {
            name: 'start',
            in: 'query',
            description: 'A token which indicates the first item to return.',
            required: false,
            schema: {
              type: 'string',
              pattern: '[a-zA-Z0-9 ]+',
              minLength: 1,
              maxLength: 128
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'The number of items to return per page.',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              maximum: 100,
              default: 10
            }
          }
        ],
        responses: {
          '200': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MovieCollection'
                },
                example: {
                  offset: 0,
                  limit: 2,
                  total_count: 2,
                  first: {
                    href: 'first page'
                  },
                  last: {
                    href: 'last page'
                  },
                  movies: [
                    { id: '1234', name: 'The Fellowship of the Ring' },
                    { id: '5678', name: 'The Two Towers' }
                  ]
                }
              }
            }
          }
        }
      }
    }
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
          pattern: '[a-zA-Z0-9 ]+',
          minLength: 1,
          maxLength: 30
        }
      },
      VerboseParam: {
        description: 'An optional verbose parameter.',
        name: 'verbose',
        required: false,
        in: 'query',
        schema: {
          type: 'boolean'
        }
      }
    },
    schemas: {
      Movie: {
        description: 'This is the Movie schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString'
          },
          name: {
            $ref: '#/components/schemas/NormalString'
          },
          director: {
            $ref: '#/components/schemas/NormalString'
          },
          running_time: {
            type: 'integer',
            format: 'int32',
            description: 'The length of the movie, in minutes.'
          },
          imdb_url: {
            $ref: '#/components/schemas/UrlString'
          },
          trailer: {
            type: 'string',
            format: 'byte',
            description: 'A short trailer for the movie.',
            minLength: 0,
            maxLength: 1024
          }
        },
        example: {
          name: 'The Two Towers',
          director: 'Peter Jackson',
          running_time: 179
        }
      },
      Drink: {
        description:
          'A Drink can be either a Juice or Soda instance. Sorry, no Beer or Whisky allowed.',
        oneOf: [
          {
            $ref: '#/components/schemas/Juice'
          },
          {
            $ref: '#/components/schemas/Soda'
          }
        ],
        discriminator: {
          propertyName: 'type'
        },
        example: {
          type: 'soda',
          name: 'Root Beer'
        }
      },
      Soda: {
        description: 'Do you really not know what a Soda is?',
        type: 'object',
        required: ['type', 'name'],
        properties: {
          type: {
            description: 'The drink type - should be "soda".',
            type: 'string',
            enum: ['soda']
          },
          name: {
            $ref: '#/components/schemas/NormalString'
          }
        }
      },
      Juice: {
        description: 'Juice box!',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice']
          },
          fruit: {
            $ref: '#/components/schemas/NormalString'
          }
        }
      },
      NormalString: {
        description: 'This is a normal string.',
        type: 'string',
        pattern: '[a-zA-Z0-9 ]+',
        minLength: 1,
        maxLength: 30
      },
      IdString: {
        description: 'An identifier of some sort.',
        type: 'string',
        readOnly: true,
        pattern: '[a-zA-Z0-9]+',
        minLength: 1,
        maxLength: 10
      },
      UrlString: {
        description: 'A URL of some sort.',
        type: 'string',
        format: 'url',
        maxLength: 1024
      },
      DrinkCollection: {
        description: 'A single page of results containing Drink instances.',
        allOf: [
          {
            $ref: '#/components/schemas/OffsetPaginationBase'
          },
          {
            type: 'object',
            required: ['drinks'],
            properties: {
              drinks: {
                description:
                  'The set of Drink instances in this page of results.',
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Drink'
                }
              }
            }
          }
        ],
        example: {
          offset: 0,
          limit: 1,
          total_count: 1,
          first: {
            href: 'first page'
          },
          next: {
            href: 'next page'
          },
          previous: {
            href: 'previous page'
          },
          last: {
            href: 'last page'
          },
          drinks: [
            {
              type: 'soda',
              name: 'Root Beer'
            }
          ]
        }
      },
      MovieCollection: {
        description: 'A single page of results containing Movie instances.',
        allOf: [
          {
            $ref: '#/components/schemas/TokenPaginationBase'
          },
          {
            type: 'object',
            required: ['movies'],
            properties: {
              movies: {
                description:
                  'The set of Movie instances in this page of results.',
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Movie'
                }
              }
            }
          }
        ],
        example: {
          offset: 0,
          limit: 1,
          total_count: 1,
          first: {
            href: 'first page'
          },
          next: {
            href: 'next page'
          },
          previous: {
            href: 'previous page'
          },
          last: {
            href: 'last page'
          },
          movies: [
            {
              name: 'The Two Towers',
              director: 'Peter Jackson',
              running_time: 179
            }
          ]
        }
      },
      OffsetPaginationBase: {
        description:
          'A base schema containing properties that support offset-limit pagination.',
        type: 'object',
        required: ['offset', 'limit', 'total_count'],
        properties: {
          offset: {
            description:
              'The offset (origin 0) of the first item returned in the result page.',
            type: 'integer',
            format: 'int32'
          },
          limit: {
            description: 'The number of items returned in the result page.',
            type: 'integer',
            format: 'int32'
          },
          total_count: {
            description: 'The total number of items across all result pages.',
            type: 'integer',
            format: 'int32'
          },
          first: {
            $ref: '#/components/schemas/PageLink'
          },
          next: {
            $ref: '#/components/schemas/PageLink'
          },
          previous: {
            $ref: '#/components/schemas/PageLink'
          },
          last: {
            $ref: '#/components/schemas/PageLink'
          }
        }
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
            format: 'int32'
          },
          total_count: {
            description: 'The total number of items across all result pages.',
            type: 'integer',
            format: 'int32'
          },
          first: {
            $ref: '#/components/schemas/PageLink'
          },
          next: {
            $ref: '#/components/schemas/PageLink'
          },
          previous: {
            $ref: '#/components/schemas/PageLink'
          },
          last: {
            $ref: '#/components/schemas/PageLink'
          }
        }
      },
      PageLink: {
        description: 'Contains a link to a page of paginated results',
        type: 'object',
        properties: {
          href: {
            description: 'The link value',
            type: 'string',
            pattern: '[a-zA-Z0-9 ]+',
            minLength: 1,
            maxLength: 30
          }
        }
      },
      RequestError: {
        description: 'This schema describes an error response.',
        type: 'object',
        properties: {
          code: {
            description: 'The error code.',
            type: 'string'
          },
          message: {
            description: 'The error message.',
            type: 'string'
          },
          more_info: {
            description: 'Additional info about the error.',
            type: 'string'
          }
        }
      },
      Error: {
        description: 'An error response.',
        type: 'object',
        properties: {
          trace: {
            description: 'The error trace information.',
            type: 'string',
            format: 'uuid'
          },
          error: {
            $ref: '#/components/schemas/RequestError'
          }
        }
      }
    },
    securitySchemes: {
      IAM: {
        in: 'header',
        name: 'Authorization',
        type: 'apiKey',
        scheme: 'Bearer'
      },
      Basic: {
        in: 'header',
        name: 'Authorization',
        type: 'http',
        scheme: 'Basic'
      },
      DrinkScheme: {
        in: 'header',
        name: 'Authorization',
        type: 'oauth2',
        scheme: 'Bearer',
        flows: {
          implicit: {
            scopes: {
              mixologist: 'Can create Drinks',
              drinker: 'Can consume beverages'
            }
          },
          authorizationCode: {
            scopes: {
              mixologist: 'Can create Drinks'
            }
          }
        }
      },
      MovieScheme: {
        in: 'header',
        name: 'Authorization',
        type: 'oauth2',
        scheme: 'Bearer',
        flows: {
          implicit: {
            scopes: {
              director: 'Can create Movies',
              moviegoer: 'Can view Movies'
            }
          },
          authorizationCode: {
            scopes: {
              director: 'Can create Movies'
            }
          }
        }
      },
      OpenIdScheme: {
        in: 'header',
        name: 'Authorization',
        type: 'openIdConnect',
        openIdConnectUrl: 'https://oauth2.com'
      }
    },
    responses: {
      ConsumedDrink: {
        description: 'Success, we consumed a drink!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Drink'
            }
          }
        }
      },
      BarIsClosed: {
        description: 'Error, no drinks to be had!',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
};
