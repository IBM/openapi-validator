// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

// Assertation 3:
// Header parameters must not define a content-type or an accept-type.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#do-not-explicitly-define-a-content-type-header-parameter

const pick = require('lodash/pick');
const includes = require('lodash/includes');
const checkCase = require('../../../utils/caseConventionCheck');
const walk = require('../../../utils/walk');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.parameters;

  walk(jsSpec, [], function(obj, path) {
    // skip parameters within operations that are excluded
    if (obj['x-sdk-exclude'] === true) {
      return;
    }
    const contentsOfParameterObject = isParameter(path, isOAS3);
    for (const head in obj.paths) {
      let topLevelIsArray = false;
      //loop through responses and see if there is an array in the top level
      if (obj.paths[head].get) {
        for (const prop in obj.paths[head].get.responses) {
          if (obj.paths[head].get.responses[prop]) {
            for (const mediaTypeKey in obj.paths[head].get.responses[prop]
              .content) {
              for (const param in obj.paths[head].get.responses[prop].content[
                mediaTypeKey
              ].schema) {
                if (
                  Array.isArray(
                    obj.paths[head].get.responses[prop].content[mediaTypeKey]
                      .schema[param]
                  )
                ) {
                  topLevelIsArray = true;
                  break;
                }
              }
            }
          }
        }
        if (obj.paths[head].get && topLevelIsArray) {
          if (
            obj.paths[head].get.parameters[0].limit &&
            (typeof obj.paths['/pets'].get.parameters[0].limit !== 'number' ||
              obj.paths[head].get.parameters[0].required.includes('limit'))
          ) {
            const message =
              'limit parameter is optional and must be of type integer and must have a default value';
            const checkStatus = config.invalid_limit_type;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
              });
            }
          }
          if (
            obj.paths[head].get.parameters[0].start &&
            (typeof obj.paths[head].get.parameters[0].start !== 'string' ||
              obj.paths[head].get.parameters[0].required == true)
          ) {
            const message =
              'start parameter must be of type string and must be optional';
            const checkStatus = config.invalid_limit_type;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
              });
            }
          }
          if (
            obj.paths[head].get.parameters[0].cursor &&
            (typeof obj.paths[head].get.parameters[0].cursor !== 'string' ||
              obj.paths[head].get.parameters[0].required == true)
          ) {
            const message =
              'cursor parameter must be of type string and must be optional';
            const checkStatus = config.invalid_limit_type;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
              });
            }
          }
          if (
            (!obj.paths['/pets'].get.parameters[0].start ||
              !obj.paths['/pets'].get.parameters[0].cursor) &&
            obj.paths['/pets'].get.parameters[0].offset &&
            (typeof obj.paths['/pets'].get.parameters[0].offset !== 'number' ||
              obj.paths['/pets'].get.parameters[0].required.includes(
                'offset'
              ) == true)
          ) {
            const message =
              'if start or cursor parameters are not present then the offset parameter should be defined as an integer and should be optional';
            const checkStatus = config.invalid_limit_type;
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

    if (contentsOfParameterObject) {
      // obj is a parameter object
      const isRef = !!obj.$ref;
      const hasDescription = !!obj.description;

      if (!hasDescription && !isRef) {
        const message = 'Parameter objects must have a `description` field.';
        const checkStatus = config.no_parameter_description;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      }

      const isParameter = obj.in; // the `in` property is required by OpenAPI for parameters - this should be true (unless obj is a ref)
      const isHeaderParameter = obj.in && obj.in.toLowerCase() === 'header'; // header params need not be checked for case

      if (isParameter && !isHeaderParameter && !isRef) {
        const checkStatus = config.param_name_case_convention[0];
        if (checkStatus !== 'off') {
          const caseConvention = config.param_name_case_convention[1];
          // Relax snakecase check to allow names with "."
          const isCorrectCase =
            !obj.name ||
            obj.name
              .split('.')
              .map(s => checkCase(s, caseConvention))
              .every(v => v);

          if (!isCorrectCase) {
            const message = `Parameter names must follow case convention: ${caseConvention}`;
            result[checkStatus].push({
              path,
              message
            });
          }
        }
      }

      if (isParameter && isHeaderParameter) {
        // check for content-type defined in a header parameter (CT = content-type)
        const checkStatusCT = config.content_type_parameter;
        const definesContentType = obj.name.toLowerCase() === 'content-type';
        let messageCT = 'Parameters must not explicitly define `Content-Type`.';
        messageCT = isOAS3
          ? `${messageCT} Rely on the \`content\` field of a request body or response object to specify content-type.`
          : `${messageCT} Rely on the \`consumes\` field to specify content-type.`;
        if (definesContentType && checkStatusCT !== 'off') {
          result[checkStatusCT].push({
            path,
            message: messageCT
          });
        }

        // check for accept-type defined in a header parameter (AT = accept-type)
        const checkStatusAT = config.accept_type_parameter;
        const definesAcceptType = obj.name.toLowerCase() === 'accept';
        let messageAT = 'Parameters must not explicitly define `Accept`.';
        messageAT = isOAS3
          ? `${messageAT} Rely on the \`content\` field of a response object to specify accept-type.`
          : `${messageAT} Rely on the \`produces\` field to specify accept-type.`;
        if (definesAcceptType && checkStatusAT !== 'off') {
          result[checkStatusAT].push({
            path,
            message: messageAT
          });
        }

        // check for accept-type defined in a header parameter (AT = accept-type)
        const checkStatusAuth = config.authorization_parameter;
        const definesAuth = obj.name.toLowerCase() === 'authorization';
        let messageAuth =
          'Parameters must not explicitly define `Authorization`.';
        messageAuth = isOAS3
          ? `${messageAuth} Rely on the \`securitySchemas\` and \`security\` fields to specify authorization methods.`
          : `${messageAuth} Rely on the \`securityDefinitions\` and \`security\` fields to specify authorization methods.`;
        // temporary message to alert users of pending status change
        if (checkStatusAuth === 'warning') {
          messageAuth =
            messageAuth +
            ' This check will be converted to an `error` in an upcoming release.';
        }
        if (definesAuth && checkStatusAuth !== 'off') {
          result[checkStatusAuth].push({
            path,
            message: messageAuth
          });
        }
      }

      const checkStatus = config.invalid_type_format_pair;
      if (checkStatus !== 'off') {
        const valid = formatValid(obj, isOAS3);
        if (!valid) {
          const message = 'Parameter type+format is not well-defined.';
          result[checkStatus].push({
            path,
            message
          });
        }
      }

      const isParameterRequired = obj.required;
      let isDefaultDefined;
      if (isOAS3) {
        isDefaultDefined = obj.schema && obj.schema.default !== undefined;
      } else {
        isDefaultDefined = obj.default !== undefined;
      }

      if (isParameterRequired && isDefaultDefined) {
        const message =
          'Required parameters should not specify default values.';
        const checkStatus = config.required_param_has_default;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};

function isParameter(path, isOAS3) {
  const pathsForParameters = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
    'components'
  ];

  const inParametersSection = path[path.length - 2] === 'parameters';

  // the above check is a necessary but not sufficient check for a parameter object
  // use the following checks to verify the object is where a parameter is supposed to be.
  // without these, a schema property named "parameters" would get validated as a parameter
  const isParameterByPath = pathsForParameters.includes(path[path.length - 3]);
  const isPathItemParameter =
    path[path.length - 4] === 'paths' && path.length === 4;
  const isTopLevelParameter =
    !isOAS3 && path[0] === 'parameters' && path.length === 2;

  return (
    inParametersSection &&
    (isParameterByPath || isPathItemParameter || isTopLevelParameter)
  );
}

function formatValid(obj, isOAS3) {
  // References will be checked when the parameters / definitions / components are scanned.
  if (obj.$ref || (obj.schema && obj.schema.$ref)) {
    return true;
  }
  const schema = obj.schema || pick(obj, ['type', 'format', 'items']);
  if (!schema.type) {
    return false;
  }
  switch (schema.type) {
    case 'integer':
      return (
        !schema.format ||
        includes(['int32', 'int64'], schema.format.toLowerCase())
      );
    case 'number':
      return (
        !schema.format ||
        includes(['float', 'double'], schema.format.toLowerCase())
      );
    case 'string':
      return (
        !schema.format ||
        includes(
          ['byte', 'binary', 'date', 'date-time', 'password'],
          schema.format.toLowerCase()
        )
      );
    case 'boolean':
      return schema.format === undefined; // No valid formats for boolean -- should be omitted
    case 'array':
      if (!schema.items) {
        return false;
      }
      return formatValid(schema.items);
    case 'object':
      return true; // TODO: validate nested schemas
    case 'file':
      return !isOAS3 && obj.in === 'formData';
  }
  return false;
}
