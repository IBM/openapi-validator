// Assertation 1:
// "Parameters MUST have an `in` property."
// `in` is REQUIRED. Possible values are "query", "header", "path" or "cookie".

// Assertation 2:
// A parameter MUST contain either a schema property, or a content property, but not both.

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject

// Assertation 3:
// A paramater should not use schema type: string, format: binary because there is now well-
// defined way to encode an octet sequence in a URL.

const { isParameterObject, walk } = require('../../../utils');
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  const configSchemas = config.schemas;
  config = config.parameters;

  walk(resolvedSpec, [], function(obj, path) {
    const isContentsOfParameterObject = isParameterObject(path, true); // 2nd arg is isOAS3

    // obj is a parameter object
    if (isContentsOfParameterObject) {
      const allowedInValues = ['query', 'header', 'path', 'cookie'];
      if (!obj.in) {
        // bad because in is required
        const checkStatus = config.no_in_property;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: path,
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
            path: path,
            message:
              'Parameters MUST have their data described by either `schema` or `content`.'
          });
        }
      } else if (obj.schema && obj.content) {
        // bad because only one is allowed to be used at a time
        const checkStatus = config.has_schema_and_content;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: path,
            message:
              'Parameters MUST NOT have both a `schema` and `content` property.'
          });
        }
      }

      const binaryStringStatus = configSchemas.json_or_param_binary_string;
      if (binaryStringStatus !== 'off') {
        const octetSequencePaths = [];
        octetSequencePaths.push(
          ...findOctetSequencePaths(obj.schema, path.concat(['schema']))
        );
        if (obj.content) {
          Object.keys(obj.content).forEach(function(mimeType) {
            if (mimeType === 'application/json') {
              const paramContentPath = path.concat([
                'content',
                mimeType,
                'schema'
              ]);
              octetSequencePaths.push(
                ...findOctetSequencePaths(
                  obj.content[mimeType].schema,
                  paramContentPath
                )
              );
            }
          });
        }

        for (const p of octetSequencePaths) {
          const message =
            'Parameters should not contain binary (type: string, format: binary) values.';
          result[binaryStringStatus].push({
            path: p,
            message
          });
        }
      }
    }
  });
  return { errors: result.error, warnings: result.warning };
};
