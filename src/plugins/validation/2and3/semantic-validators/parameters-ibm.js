// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

// Assertation 3:
// Header parameters must not define a content-type or an accept-type.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#do-not-explicitly-define-a-content-type-header-parameter

const { checkCase, isParameterObject, walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const messages = new MessageCarrier();

  config = config.parameters;

  walk(jsSpec, [], function(obj, path) {
    // skip parameters within operations that are excluded
    if (obj['x-sdk-exclude'] === true) {
      return;
    }

    const contentsOfParameterObject = isParameterObject(path, isOAS3);

    if (contentsOfParameterObject) {
      // obj is a parameter object
      const isRef = !!obj.$ref;
      const hasDescription = !!obj.description;

      if (!hasDescription && !isRef) {
        messages.addMessage(
          path,
          'Parameter objects must have a `description` field.',
          config.no_parameter_description
        );
      }

      const isParameter = obj.in; // the `in` property is required by OpenAPI for parameters - this should be true (unless obj is a ref)
      const isHeaderParameter = obj.in && obj.in.toLowerCase() === 'header'; // header params need not be checked for case
      const isDeprecated = obj.deprecated === true;

      if (isParameter && !isHeaderParameter && !isRef && !isDeprecated) {
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
            messages.addMessage(
              path,
              `Parameter names must follow case convention: ${caseConvention}`,
              checkStatus
            );
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
        if (definesContentType) {
          messages.addMessage(path, messageCT, checkStatusCT);
        }

        // check for accept-type defined in a header parameter (AT = accept-type)
        const checkStatusAT = config.accept_type_parameter;
        const definesAcceptType = obj.name.toLowerCase() === 'accept';
        let messageAT = 'Parameters must not explicitly define `Accept`.';
        messageAT = isOAS3
          ? `${messageAT} Rely on the \`content\` field of a response object to specify accept-type.`
          : `${messageAT} Rely on the \`produces\` field to specify accept-type.`;
        if (definesAcceptType) {
          messages.addMessage(path, messageAT, checkStatusAT);
        }

        // check for accept-type defined in a header parameter (AT = accept-type)
        const checkStatusAuth = config.authorization_parameter;
        const definesAuth = obj.name.toLowerCase() === 'authorization';
        let messageAuth =
          'Parameters must not explicitly define `Authorization`.';
        messageAuth = isOAS3
          ? `${messageAuth} Rely on the \`securitySchemes\` and \`security\` fields to specify authorization methods.`
          : `${messageAuth} Rely on the \`securityDefinitions\` and \`security\` fields to specify authorization methods.`;
        // temporary message to alert users of pending status change
        if (checkStatusAuth === 'warning') {
          messageAuth =
            messageAuth +
            ' This check will be converted to an `error` in an upcoming release.';
        }
        if (definesAuth) {
          messages.addMessage(path, messageAuth, checkStatusAuth);
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
        messages.addMessage(
          path,
          'Required parameters should not specify default values.',
          config.required_param_has_default
        );
      }
    }
  });

  return messages;
};
