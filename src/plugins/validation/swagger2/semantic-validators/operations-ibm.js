// Assertation 1:
// PUT and POST operations with body parameter must have a non-empty `consumes` field

// Assertation 2:
// GET operations should not specify a consumes field.

// Assertation 3:
// GET operations must have a non-empty `produces` field.

const each = require('lodash/each');
const includes = require('lodash/includes');
const map = require('lodash/map');
const pick = require('lodash/pick');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }, config) {
  const messages = new MessageCarrier();

  config = config.operations;

  map(jsSpec.paths, (path, pathKey) => {
    if (pathKey.slice(0, 2) === 'x-') {
      return;
    }
    const pathOps = pick(path, [
      'get',
      'head',
      'post',
      'put',
      'patch',
      'delete',
      'options'
    ]);
    each(pathOps, (op, opKey) => {
      // if operation is excluded, don't validate it
      if (!op || op['x-sdk-exclude'] === true) {
        // skip this operation in the 'each' loop
        return;
      }

      if (includes(['put', 'post'], opKey.toLowerCase())) {
        const hasLocalConsumes =
          op.consumes &&
          op.consumes.length > 0 &&
          !!op.consumes.join('').trim();
        const hasGlobalConsumes = !!jsSpec.consumes;

        // Check for body parameter in path
        let hasBodyParamInPath = false;
        if (path.parameters) {
          path.parameters.forEach(parameter => {
            if (parameter.in === 'body') {
              hasBodyParamInPath = true;
            }
          });
        }

        // Check for body parameter in operation
        let hasBodyParamInOps = false;
        if (op.parameters) {
          op.parameters.forEach(parameter => {
            if (parameter.in === 'body') {
              hasBodyParamInOps = true;
            }
          });
        }

        if (
          !hasLocalConsumes &&
          !hasGlobalConsumes &&
          (hasBodyParamInOps || hasBodyParamInPath)
        ) {
          messages.addMessage(
            `paths.${pathKey}.${opKey}.consumes`,
            'PUT and POST operations with a body parameter must have a non-empty `consumes` field.',
            config.no_consumes_for_put_or_post,
            'no_consumes_for_put_or_post'
          );
        }
      }

      const isHeadOperation = opKey.toLowerCase() === 'head';
      if (!isHeadOperation) {
        // operations should have a produces property
        const hasLocalProduces =
          op.produces &&
          op.produces.length > 0 &&
          !!op.produces.join('').trim();
        const hasGlobalProduces = !!jsSpec.produces;

        // determine if only success response is a 204
        const responses = op.responses || {};
        const successResponses = Object.keys(responses).filter(
          code => code.charAt(0) === '2'
        );
        const onlyHas204 =
          successResponses.length === 1 && successResponses[0] === '204';

        if (!hasLocalProduces && !hasGlobalProduces && !onlyHas204) {
          messages.addMessage(
            `paths.${pathKey}.${opKey}.produces`,
            'Operations must have a non-empty `produces` field.',
            config.no_produces,
            'no_produces'
          );
        }
      }

      const isGetOperation = opKey.toLowerCase() === 'get';
      if (isGetOperation) {
        // get operations should not have a consumes property
        if (op.consumes) {
          messages.addMessage(
            `paths.${pathKey}.${opKey}.consumes`,
            'GET operations should not specify a consumes field.',
            config.get_op_has_consumes,
            'get_op_has_consumes'
          );
        }
      }
    });
  });

  return messages;
};
