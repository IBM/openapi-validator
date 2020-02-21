// Assertation 1: Operations cannot have both a 'body' parameter and a 'formData' parameter.
// Assertation 2: Operations must have only one body parameter.

const pick = require('lodash/pick');
const map = require('lodash/map');
const each = require('lodash/each');
const findIndex = require('lodash/findIndex');
const findLastIndex = require('lodash/findLastIndex');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ resolvedSpec }) {
  const messages = new MessageCarrier();

  map(resolvedSpec.paths, (path, pathKey) => {
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
      if (!op) {
        return;
      }

      // Assertation 1
      const bodyParamIndex = findIndex(op.parameters, ['in', 'body']);
      const formDataParamIndex = findIndex(op.parameters, ['in', 'formData']);
      if (bodyParamIndex > -1 && formDataParamIndex > -1) {
        messages.addMessage(
          `paths.${pathKey}.${opKey}.parameters`,
          'Operations cannot have both a "body" parameter and "formData" parameter',
          'error'
        );
      }
      // Assertation 2
      const lastBodyParamIndex = findLastIndex(op.parameters, ['in', 'body']);
      if (bodyParamIndex !== lastBodyParamIndex) {
        messages.addMessage(
          `paths.${pathKey}.${opKey}.parameters`,
          'Operations must have no more than one body parameter',
          'error'
        );
      }
    });
  });

  return messages;
};
