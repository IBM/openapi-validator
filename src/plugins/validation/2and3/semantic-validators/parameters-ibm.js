// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

// Assertation 3:
// Header parameters must not define a content-type or an accept-type.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#do-not-explicitly-define-a-content-type-header-parameter

const pick = require('lodash/pick');
const includes = require('lodash/includes');
const checkSnakecase = require('../../../utils/checkSnakeCase');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.parameters;

  function walk(obj, path) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1];
    if (
      current === 'example' ||
      current === 'examples' ||
      (current && current.slice(0, 2) === 'x-')
    ) {
      return;
    }

    // skip parameters within operations that are excluded
    if (obj['x-sdk-exclude'] === true) {
      return;
    }

    const contentsOfParameterObject = path[path.length - 2] === 'parameters';

    // obj is a parameter object
    if (contentsOfParameterObject) {
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
      const isHeaderParameter = obj.in && obj.in.toLowerCase() === 'header'; // header params need not be snake_case
      // Relax snakecase check to allow names with "."
      const isSnakecase =
        !obj.name ||
        obj.name
          .split('.')
          .map(s => checkSnakecase(s))
          .every(v => v);

      // if the parameter is defined by a ref, no need to check the ref path for snake_case
      if (isParameter && !isHeaderParameter && !isRef && !isSnakecase) {
        const message = 'Parameter names must be lower snake case.';
        const checkStatus = config.snake_case_only;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
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
    if (Object.keys(obj).length) {
      return Object.keys(obj).map(k => {
        // ignore validating all extensions - users need to use custom schemas
        if (k.slice(0, 2) !== 'x-') {
          return walk(obj[k], [...path, k]);
        }
      });
    } else {
      return null;
    }
  }

  walk(jsSpec, []);
  return { errors: result.error, warnings: result.warning };
};

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
