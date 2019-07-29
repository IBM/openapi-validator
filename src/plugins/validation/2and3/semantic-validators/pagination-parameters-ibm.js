// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

// Assertation 3:
// Header parameters must not define a content-type or an accept-type.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#do-not-explicitly-define-a-content-type-header-parameter

const walk = require('../../../utils/walk');

module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.pagination_parameters;

  walk(jsSpec, [], function(obj, path) {
    // skip parameters within operations that are excluded
    if (obj['x-sdk-exclude'] === true) {
      return;
    }
    const names = [];
    const checkStatus = config.pagination_style;
    if (checkStatus !== 'off') {
      for (const head in obj.paths) {
        let topLevelIsArray = false;
        //loop through responses and see if there is an array in the top level
        if (obj.paths[head].get) {
          for (const prop in obj.paths[head].get.responses) {
            if (obj.paths[head].get.responses[prop].content) {
              for (const mediaTypeKey in obj.paths[head].get.responses[prop]
                .content) {
                for (const param in obj.paths[head].get.responses[prop].content[
                  mediaTypeKey
                ].schema) {
                  if (
                    obj.paths[head].get.responses[prop].content[mediaTypeKey]
                      .schema[param].constructor === Array
                  ) {
                    topLevelIsArray = true;
                    break;
                  }
                }
              }
            }
          }
          if (obj.paths[head].get && topLevelIsArray) {
            for (const parameter in obj.paths[head].get.parameters) {
              names.push(obj.paths[head].get.parameters[parameter].name);
              if (
                obj.paths[head].get.parameters[parameter].name === 'limit' &&
                (obj.paths[head].get.parameters[parameter].schema.type !==
                  'integer' ||
                  obj.paths[head].get.parameters[parameter].required === true)
              ) {
                const message =
                  'limit parameter is optional and must be of type integer and must have a default value';
                result[checkStatus].push({
                  path,
                  message
                });
              }
              if (
                obj.paths[head].get.parameters[parameter].name === 'start' &&
                (obj.paths[head].get.parameters[parameter].schema.type !==
                  'string' ||
                  obj.paths[head].get.parameters[parameter].required == true)
              ) {
                const message =
                  'start parameter must be of type string and must be optional';
                result[checkStatus].push({
                  path,
                  message
                });
              }
              if (
                obj.paths[head].get.parameters[parameter].name === 'cursor' &&
                (obj.paths[head].get.parameters[parameter].schema.type !==
                  'string' ||
                  obj.paths[head].get.parameters[parameter].required == true)
              ) {
                const message =
                  'cursor parameter must be of type string and must be optional';
                result[checkStatus].push({
                  path,
                  message
                });
              }
            }
            if (
              !names.includes('start') &&
              !names.includes('cursor') &&
              !names.includes('offset')
            ) {
              const message =
                'if start or cursor parameters are not present then the offset parameter should be defined as an integer and should be optional';
              const checkStatus = config.pagination_style;
              if (checkStatus !== 'off') {
                result[checkStatus].push({
                  path,
                  message
                });
              }
            }
          }
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};
