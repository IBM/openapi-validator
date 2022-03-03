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
  paths: {
    '/v1/drinks': {
      post: {
        operationId: 'createDrink',
        summary: 'Create a drink',
        description: 'Create a new Drink instance.',
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
        operationId: 'getDrink',
        summary: 'Have a drink',
        description: 'Retrieve and consume a refreshing beverage.',
        parameters: [
          {
            $ref: '#/components/parameters/VerboseParam'
          }
        ],
        responses: {
          '200': {
            description: 'Success, we had a drink!',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Drink'
                }
              }
            }
          },
          '400': {
            description: 'Error, no drinks to be had!',
            content: {
              'application/json': {
                schema: {
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
              }
            }
          }
        }
      }
    },
    '/v1/movies': {
      post: {
        operationId: 'createMovie',
        summary: 'Create a movie',
        description: 'Create a new Movie instance.',
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
                  description: 'An error response.',
                  type: 'object',
                  properties: {
                    trace: {
                      description: 'The trace information',
                      type: 'string',
                      format: 'uuid'
                    },
                    error: {
                      $ref: '#/components/schemas/RequestError'
                    }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        operationId: 'listMovies',
        summary: 'List movies',
        description:
          'Retrieve a list of movies using an optional genre qualifier.',
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
          }
        ],
        responses: {
          '200': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  description: 'A response containing a list of movies.',
                  type: 'object',
                  properties: {
                    movies: {
                      description: 'The movie list.',
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Movie'
                      }
                    }
                  }
                },
                example: {
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
      }
    }
  }
};
