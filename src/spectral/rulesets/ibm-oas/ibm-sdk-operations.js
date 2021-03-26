const AJV = require('ajv');
const ajv = new AJV({ allErrors: true, jsonPointers: true });
const jsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'IBM SDK Operations Extension',
  description: 'sdk operations extension schema',
  properties: {
    'x-sdk-operations': {
      properties: {
        'request-examples': {
          additionalProperties: {
            $ref: '#/definitions/x-sdk-request-examples-array'
          }
        }
      },
      additionalProperties: false
    }
  },
  definitions: {
    'x-sdk-request-examples-array': {
      type: 'array',
      items: {
        $ref: '#/definitions/x-sdk-request-example'
      }
    },
    'x-sdk-request-example': {
      properties: {
        name: {
          type: 'string',
          description:
            'The name or title of the example. In documentation it should appear as a header above the example.'
        },
        contentType: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The media type of the response in this example.'
          }
        },
        example: {
          type: 'array',
          description:
            'An array of code or text elements that make up the example',
          items: {
            $ref: '#/definitions/x-sdk-request-example-element'
          }
        },
        response: {},
        description: {
          type: 'string'
        }
      },
      required: ['name', 'example'],
      additionalProperties: false
    },
    'x-sdk-request-example-element': {
      description: 'An element of the request example.',
      properties: {
        name: {
          type: 'string',
          description:
            'The name or title of the example element. In documentation it should appear as a header above the example element.'
        },
        type: {
          type: 'string',
          description:
            'The element type indicates the type of content in the element. `text` elements contain a textual description or explanation, possibly using markdown for rich text elements. `code` elements contain code appropriate for the language of the request example. `code` elements will be presented in a `<pre><code>` block in documentation and should contain no markup or escapes other than escapes for quote and backslash (required for JSON).',
          enum: ['text', 'code']
        },
        source: {
          type: 'array',
          items: {
            type: 'string'
          },
          description:
            'Content of the example element as an array of strings. The content is formed by simple concatenation of the array elements.'
        }
      },
      required: ['type', 'source']
    }
  }
};

module.exports = function(sdkOperations, _opts, paths) {
  const errors = [];
  const sdkSchema = {
    'x-sdk-operations': sdkOperations
  };
  const rootPath = paths.target !== void 0 ? paths.target : paths.given;
  const validate = ajv.compile(jsonSchema);
  if (!ajv.validate(jsonSchema, sdkSchema)) {
    return formatAJVErrors(validate.errors, rootPath);
  }
  return errors;
};

function formatAJVErrors(errors, rootPath) {
  const errorList = [];
  errors.forEach(function(err) {
    errorList.push({
      message: err.message,
      path: getErrPath(err, rootPath)
    });
  });
  return errorList;
}

function getErrPath(err, rootPath) {
  const relativePath = err.dataPath.split('/');
  if (relativePath.length > 1) {
    const strippedPath = relativePath.splice(
      relativePath.indexOf('x-sdk-operations') + 1,
      relativePath.length
    );
    return [...rootPath, ...strippedPath];
  }
  return rootPath;
}
