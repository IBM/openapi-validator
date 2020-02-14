const expect = require('expect');
const { hasRefProperty } = require('../../../src/plugins/utils');

const spec = {
  paths: {
    '/resource': {
      post: {
        description: 'a simple operation',
        requestBody: {
          $ref: 'external.yaml#/resource-post-request-body'
        },
        responses: {
          '200': {
            description: 'a simple response'
          },
          '400': {
            $ref: '#/components/responses/ErrorResponse'
          }
        }
      }
    }
  },
  components: {
    responses: {
      ErrorResponse: {
        description: 'error response with content',
        content: {
          'application/json': {
            schema: {
              $ref: 'external.yaml#/error-response-schema'
            }
          }
        }
      }
    }
  }
};

describe('has ref property - util', () => {
  it('should return true when array leads to $ref property', () => {
    const path = ['paths', '/resource', 'post', 'requestBody'];
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(true);
  });

  it('should return true when dot-separated-string leads to $ref property', () => {
    const path = 'paths./resource.post.requestBody';
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(true);
  });

  it('should return false when array does not lead to $ref property', () => {
    const path = ['paths', '/resource', 'post', 'responses', '200'];
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(false);
  });

  it('should return false when dot-separated-string does not lead to $ref property', () => {
    const path = 'paths./resource.post.responses.200';
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(false);
  });

  it('should return false when path leads to somewhere non-existent in the spec', () => {
    const path = ['paths', '/resource', 'get', 'responses', '200'];
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(false);
  });

  it('should return false when path leads through $ref - currently unsupported', () => {
    const path = [
      'paths',
      '/resource',
      'post',
      'responses',
      '400',
      'content',
      'application/json',
      'schema'
    ];
    const hasRef = hasRefProperty(spec, path);

    expect(hasRef).toBe(false);
  });
});
