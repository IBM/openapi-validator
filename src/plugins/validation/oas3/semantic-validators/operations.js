// Assertation 1. Request body objects must have a `content` property
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject

// Assertation 2. Operations with non-form request bodies should set the `x-codegen-request-body-name`
// annotation (for code generation purposes)

const pick = require('lodash/pick');
const each = require('lodash/each');
const at = require('lodash/at');

module.exports.validate = function({ resolvedSpec, jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

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
          const checkStatus = config.no_request_body_content;
          if (checkStatus !== 'off') {
            result[checkStatus].push({
              path: `paths.${pathName}.${opName}.requestBody`,
              message: 'Request bodies MUST specify a `content` property'
            });
          }
        } else {
          // request body has content
          const firstMimeType = requestBodyMimeTypes[0]; // code generation uses the first mime type
          const oneContentType = requestBodyMimeTypes.length === 1;
          const isJson = firstMimeType === 'application/json';

          const hasArraySchema =
            requestBodyContent[firstMimeType].schema &&
            requestBodyContent[firstMimeType].schema.type === 'array';

          const hasRequestBodyName =
            op[REQUEST_BODY_NAME] && op[REQUEST_BODY_NAME].trim().length;

          // non-array json responses with only one content type will have
          // the body exploded in sdk generation, no need for name
          const explodingBody = oneContentType && isJson && !hasArraySchema;

          // referenced request bodies have names
          const referencedRequestBody = Boolean(
            at(jsSpec, `paths.${pathName}.${opName}.requestBody`)[0].$ref
          );

          // form params do not need names
          if (
            !isFormParameter(firstMimeType) &&
            !explodingBody &&
            !referencedRequestBody &&
            !hasRequestBodyName
          ) {
            const checkStatus = config.no_request_body_name;
            if (checkStatus != 'off') {
              const message =
                'Operations with non-form request bodies should set a name with the x-codegen-request-body-name annotation.';
              result[checkStatus].push({
                path: `paths.${pathName}.${opName}`,
                message
              });
            }
          }
        }
      }
    });
  });

  return { errors: result.error, warnings: result.warning };
};

function isFormParameter(mimeType) {
  const formDataMimeTypes = [
    'multipart/form-data',
    'application/x-www-form-urlencoded',
    'application/octet-stream'
  ];
  return formDataMimeTypes.includes(mimeType);
}
