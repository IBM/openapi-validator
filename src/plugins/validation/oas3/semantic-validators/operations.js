// Assertation 1. Request body objects must have a `content` property
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject

// Assertation 2. Operations with non-form request bodies should set the `x-codegen-request-body-name`
// annotation (for code generation purposes)

// Assertation 3. Request bodies with application/json content should not use schema
// type: string, format: binary.

const pick = require('lodash/pick');
const each = require('lodash/each');
const { hasRefProperty } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec, jsSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;
  config = config.operations;

  const REQUEST_BODY_NAME = 'x-codegen-request-body-name';

  // get, head, and delete are not in this list because they are not allowed
  // to have request bodies
  const allowedOps = ['post', 'put', 'patch', 'options', 'trace'];

  each(resolvedSpec.paths, (path, pathName) => {
    const operations = pick(path, allowedOps);
    each(operations, (op, opName) => {
      if (!op || op['x-sdk-exclude'] === true) {
        return;
      }
      // Assertation 1
      if (op.requestBody) {
        const requestBodyContent = op.requestBody.content;
        const requestBodyMimeTypes =
          op.requestBody.content && Object.keys(requestBodyContent);
        if (!requestBodyContent || !requestBodyMimeTypes.length) {
          messages.addMessage(
            `paths.${pathName}.${opName}.requestBody`,
            'Request bodies MUST specify a `content` property',
            config.no_request_body_content,
            'no_request_body_content'
          );
        } else {
          // request body has content
          const firstMimeType = requestBodyMimeTypes[0]; // code generation uses the first mime type
          const oneContentType = requestBodyMimeTypes.length === 1;
          const isJson =
            firstMimeType === 'application/json' ||
            firstMimeType.endsWith('+json');

          const hasArraySchema =
            requestBodyContent[firstMimeType].schema &&
            requestBodyContent[firstMimeType].schema.type === 'array';

          const hasRequestBodyName =
            op[REQUEST_BODY_NAME] && op[REQUEST_BODY_NAME].trim().length;

          // non-array json responses with only one content type will have
          // the body exploded in sdk generation, no need for name
          const explodingBody = oneContentType && isJson && !hasArraySchema;

          // referenced request bodies have names
          const hasReferencedRequestBody = hasRefProperty(jsSpec, [
            'paths',
            pathName,
            opName,
            'requestBody'
          ]);

          // form params do not need names
          if (
            !isFormParameter(firstMimeType) &&
            !explodingBody &&
            !hasReferencedRequestBody &&
            !hasRequestBodyName
          ) {
            messages.addMessage(
              `paths.${pathName}.${opName}`,
              'Operations with non-form request bodies should set a name with the x-codegen-request-body-name annotation.',
              config.no_request_body_name,
              'no_request_body_name'
            );
          }

          // Assertation 3
          const binaryStringStatus = configSchemas.json_or_param_binary_string;
          if (binaryStringStatus !== 'off') {
            for (const mimeType of requestBodyMimeTypes) {
              if (mimeType === 'application/json') {
                const schemaPath = `paths.${pathName}.${opName}.requestBody.content.${mimeType}.schema`;
                const octetSequencePaths = findOctetSequencePaths(
                  requestBodyContent[mimeType].schema,
                  schemaPath
                );
                for (const p of octetSequencePaths) {
                  messages.addMessage(
                    p,
                    'JSON request/response bodies should not contain binary (type: string, format: binary) values.',
                    binaryStringStatus,
                    'json_or_param_binary_string'
                  );
                }
              }
            }
          }
        }
      }
    });
  });

  return messages;
};

function isFormParameter(mimeType) {
  const formDataMimeTypes = [
    'multipart/form-data',
    'application/x-www-form-urlencoded',
    'application/octet-stream'
  ];
  return formDataMimeTypes.includes(mimeType);
}
