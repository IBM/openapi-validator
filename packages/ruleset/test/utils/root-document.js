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
    '/v1/movies': {
      post: {
        operationId: 'createMovie',
        summary: 'Create a movie',
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
                  type: 'object',
                  properties: {
                    trace: {
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
        responses: {
          '200': {
            description: 'Success!',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    movies: {
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
    schemas: {
      Movie: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            readOnly: true,
            pattern: '[a-zA-Z0-9]+',
            minLength: 1,
            maxLength: 30
          },
          name: {
            type: 'string',
            pattern: '[a-zA-Z0-9]+',
            minLength: 1,
            maxLength: 30
          },
          director: {
            type: 'string',
            pattern: '[a-zA-Z0-9]+',
            minLength: 1,
            maxLength: 30
          }
        },
        example: {
          name: 'The Two Towers',
          director: 'Peter Jackson'
        }
      },
      RequestError: {
        type: 'object',
        properties: {
          code: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          more_info: {
            type: 'string'
          }
        }
      }
    }
  }
};
