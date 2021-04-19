const inCodeValidator = require('../../../../src/lib');

describe('spectral - test validation that schema provided in content object', function() {
  it('should error only when parameter does not provide a schema or content', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query'
                // no schema or content object
              }
            ]
          }
        },
        createOwner: {
          post: {
            operationId: 'addOwner',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query',
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'exampleParam2',
                description: 'example param 2',
                in: 'query',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              }
            ]
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedErrors = res.errors.filter(
      err => err.message === 'Parameter must provide either a schema or content'
    );
    expect(expectedErrors.length).toBe(1);
  });
});
