// Assertation 1:
// "Parameters MUST have an `in` property."
// `in` is REQUIRED. Possible values are "query", "header", "path" or "cookie".

// Assertation 2:
// A parameter MUST contain either a schema property, or a content property, but not both.

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject

const walk = require('../../../utils/walk');

module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.parameters;

  walk(jsSpec, [], function(obj, path) {
    const isContentsOfParameterObject = path[path.length - 2] === 'parameters';
    const isRef = !!obj.$ref;

    // obj is a parameter object
    if (isContentsOfParameterObject && !isRef) {
      const allowedInValues = ['query', 'header', 'path', 'cookie'];
      if (!obj.in) {
        // bad because in is required
        const checkStatus = config.no_in_property;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message: 'Parameters MUST have an `in` property.'
          });
        }
      } else if (!allowedInValues.includes(obj.in)) {
        // bad because `in` must be one of a few values
        const checkStatus = config.invalid_in_property;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: path.concat('in'),
            message: `Unsupported value for \`in\`: '${
              obj.in
            }'. Allowed values are ${allowedInValues.join(', ')}`
          });
        }
      }

      if (!obj.schema && !obj.content) {
        // bad because at least one is needed
        const checkStatus = config.missing_schema_or_content;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message:
              'Parameters MUST have their data described by either `schema` or `content`.'
          });
        }
      } else if (obj.schema && obj.content) {
        // bad because only one is allowed to be used at a time
        const checkStatus = config.has_schema_and_content;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message:
              'Parameters MUST NOT have both a `schema` and `content` property.'
          });
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};
