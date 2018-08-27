// Assertation 1. Request body objects must have a `content` property
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject

const pick = require('lodash/pick');
const each = require('lodash/each');

module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.operations;

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
        if (!requestBodyContent || !Object.keys(requestBodyContent).length) {
          const checkStatus = config.no_request_body_content;
          if (checkStatus !== 'off') {
            result.error.push({
              path: `paths.${pathName}.${opName}.requestBody`,
              message: 'Request bodies MUST specify a `content` property'
            });
          }
        }
      }
    });
  });

  return { errors: result.error, warnings: result.warning };
};
