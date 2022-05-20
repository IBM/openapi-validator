// Assertations

// Operations must have unique (name + in combination) parameters.
// Covered by spectral:oas 'operation-parameters' rule

// `operationId` should adhere to a given case convention
// Replaced by new rule

// Arrays MUST NOT be returned as the top-level structure in a response body.
// ref: https://pages.github.ibm.com/CloudEngineering/api_handbook/fundamentals/format.html#object-encapsulation

// All required parameters of an operation are listed before any optional parameters.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#parameter-order

const pick = require('lodash/pick');
const map = require('lodash/map');
const each = require('lodash/each');
const { hasRefProperty } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');

module.exports.validate = function({ jsSpec, resolvedSpec }) {
  const messages = new MessageCarrier();

  map(resolvedSpec.paths, (path, pathKey) => {
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
      'options',
      'trace'
    ]);

    each(pathOps, (op, opKey) => {
      if (!op || op['x-sdk-exclude'] === true) {
        return;
      }

      // check for operations that have a $ref property
      // these are illegal in the spec
      if (hasRefProperty(jsSpec, ['paths', pathKey, opKey])) {
        messages.addMessage(
          `paths.${pathKey}.${opKey}.$ref`,
          '$ref found in illegal location',
          'error'
        );
      }
    });
  });

  return messages;
};
