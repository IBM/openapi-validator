// Assertations

// Operations must have unique (name + in combination) parameters.

// `operationId` should adhere to a given case convention

// Arrays MUST NOT be returned as the top-level structure in a response body.
// ref: https://pages.github.ibm.com/CloudEngineering/api_handbook/fundamentals/format.html#object-encapsulation

// All required parameters of an operation are listed before any optional parameters.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#parameter-order

const pick = require('lodash/pick');
const map = require('lodash/map');
const each = require('lodash/each');
const { checkCase, hasRefProperty } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');

module.exports.validate = function({ jsSpec, resolvedSpec, isOAS3 }, config) {
  const messages = new MessageCarrier();

  config = config.operations;

  const globalTags = resolvedSpec.tags || [];
  const hasGlobalTags = !!globalTags.length;
  const resolvedTags = globalTags.map(({ name }) => name);
  const unusedTags = new Set(resolvedTags);

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

      // Arrays MUST NOT be returned as the top-level structure in a response body.
      const checkStatusArrRes = config.no_array_responses;
      if (checkStatusArrRes !== 'off') {
        each(op.responses, (response, name) => {
          if (isOAS3) {
            each(response.content, (content, contentType) => {
              const isArray =
                content.schema &&
                (content.schema.type === 'array' || content.schema.items);

              if (isArray) {
                messages.addMessage(
                  `paths.${pathKey}.${opKey}.responses.${name}.content.${contentType}.schema`,
                  'Arrays MUST NOT be returned as the top-level structure in a response body.',
                  checkStatusArrRes,
                  'no_array_responses'
                );
              }
            });
          } else {
            const isArray =
              response.schema &&
              (response.schema.type === 'array' || response.schema.items);

            if (isArray) {
              messages.addMessage(
                `paths.${pathKey}.${opKey}.responses.${name}.schema`,
                'Arrays MUST NOT be returned as the top-level structure in a response body.',
                checkStatusArrRes,
                'no_array_responses'
              );
            }
          }
        });
      }

      const hasOperationId =
        op.operationId &&
        op.operationId.length > 0 &&
        !!op.operationId.toString().trim();
      if (hasOperationId) {
        // check operationId for case convention
        const checkStatus = config.operation_id_case_convention[0];
        if (checkStatus !== 'off') {
          const caseConvention = config.operation_id_case_convention[1];
          const isCorrectCase = checkCase(op.operationId, caseConvention);
          if (!isCorrectCase) {
            messages.addMessage(
              `paths.${pathKey}.${opKey}.operationId`,
              `operationIds must follow case convention: ${caseConvention}`,
              checkStatus,
              'operation_id_case_convention'
            );
          }
        }
      }
      const hasOperationTags = op.tags && op.tags.length > 0;
      if (hasOperationTags && hasGlobalTags) {
        for (let i = 0, len = op.tags.length; i < len; i++) {
          if (!resolvedTags.includes(op.tags[i])) {
            messages.addMessage(
              `paths.${pathKey}.${opKey}.tags`,
              'tag is not defined at the global level: ' + op.tags[i],
              config.undefined_tag,
              'undefined_tag'
            );
          } else {
            unusedTags.delete(op.tags[i]);
          }
        }
      }

      // this should be good with resolved spec, but double check
      // All required parameters of an operation are listed before any optional parameters.
      const checkStatusParamOrder = config.parameter_order;
      if (checkStatusParamOrder !== 'off') {
        if (op.parameters && op.parameters.length > 0) {
          let firstOptional = -1;
          for (let indx = 0; indx < op.parameters.length; indx++) {
            const param = op.parameters[indx];
            if (firstOptional < 0) {
              if (!param.required) {
                firstOptional = indx;
              }
            } else {
              if (param.required) {
                messages.addMessage(
                  `paths.${pathKey}.${opKey}.parameters[${indx}]`,
                  'Required parameters should appear before optional parameters.',
                  checkStatusParamOrder,
                  'parameter_order'
                );
              }
            }
          }
        }
      }
    });
  });

  unusedTags.forEach(tagName => {
    messages.addMessage(
      `tags`,
      `A tag is defined but never used: ${tagName}`,
      config.unused_tag,
      'unused_tag'
    );
  });

  return messages;
};
