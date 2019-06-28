// Assertations

// Operations must have unique (name + in combination) parameters.

// Operations must have a non-empty `operationId`

// `operationId` should adhere to a given case convention

// Operations must have a non-empty `summary` field.

// Arrays MUST NOT be returned as the top-level structure in a response body.
// ref: https://pages.github.ibm.com/CloudEngineering/api_handbook/fundamentals/format.html#object-encapsulation

// All required parameters of an operation are listed before any optional parameters.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#parameter-order

const pick = require('lodash/pick');
const map = require('lodash/map');
const each = require('lodash/each');
const findIndex = require('lodash/findIndex');
const checkCase = require('../../../utils/caseConventionCheck');

module.exports.validate = function({ resolvedSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.operations;

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

      // check for unique name/in properties in params
      each(op.parameters, (param, paramIndex) => {
        const nameAndInComboIndex = findIndex(op.parameters, {
          name: param.name,
          in: param.in
        });
        // comparing the current index against the first found index is good, because
        // it cuts down on error quantity when only two parameters are involved,
        // i.e. if param1 and param2 conflict, this will only complain about param2.
        // it also will favor complaining about parameters later in the spec, which
        // makes more sense to the user.
        if (paramIndex !== nameAndInComboIndex) {
          result.error.push({
            path: `paths.${pathKey}.${opKey}.parameters[${paramIndex}]`,
            message:
              "Operation parameters must have unique 'name' + 'in' properties"
          });
        }
      });

      // Arrays MUST NOT be returned as the top-level structure in a response body.
      const checkStatusArrRes = config.no_array_responses;
      if (checkStatusArrRes !== 'off') {
        each(op.responses, (response, name) => {
          if (isOAS3) {
            each(response.content, (content, contentType) => {
              if (content.schema && content.schema.type === 'array') {
                result[checkStatusArrRes].push({
                  path: `paths.${pathKey}.${opKey}.responses.${name}.content.${contentType}.schema`,
                  message:
                    'Arrays MUST NOT be returned as the top-level structure in a response body.'
                });
              }
            });
          } else {
            if (response.schema && response.schema.type === 'array') {
              result[checkStatusArrRes].push({
                path: `paths.${pathKey}.${opKey}.responses.${name}.schema`,
                message:
                  'Arrays MUST NOT be returned as the top-level structure in a response body.'
              });
            }
          }
        });
      }

      const hasOperationId =
        op.operationId &&
        op.operationId.length > 0 &&
        !!op.operationId.toString().trim();
      if (!hasOperationId) {
        const checkStatus = config.no_operation_id;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: 'Operations must have a non-empty `operationId`.'
          });
        }
      } else {
        // check operationId for case convention
        const checkStatus = config.operation_id_case_convention[0];
        const caseConvention = config.operation_id_case_convention[1];
        const isCorrectCase = checkCase(op.operationId, caseConvention);
        if (!isCorrectCase && checkStatus != 'off') {
          result[checkStatus].push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: `operationIds must follow case convention: ${caseConvention}`
          });
        }
      }
      const hasOperationTags = op.tags && op.tags.length > 0;
      const hasGlobalTags = resolvedSpec.tags && resolvedSpec.tags.length > 0;
      const resolvedTags = [];
      if (hasOperationTags && hasGlobalTags) {
        for (let i = 0; i < resolvedSpec.tags.length; i++) {
          resolvedTags.push(resolvedSpec.tags[i].name);
        }
        for (let i = 0, len = op.tags.length; i < len; i++) {
          if (!resolvedTags.includes(op.tags[i])) {
            const checkStatus = config.unused_tag;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path: `paths.${pathKey}.${opKey}.tags`,
                message: 'tag is not defined at the global level: ' + op.tags[i]
              });
            }
          }
        }
      }

      const hasSummary =
        op.summary && op.summary.length > 0 && !!op.summary.toString().trim();
      if (!hasSummary) {
        const checkStatus = config.no_summary;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: `paths.${pathKey}.${opKey}.summary`,
            message: 'Operations must have a non-empty `summary` field.'
          });
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
                result[checkStatusParamOrder].push({
                  path: `paths.${pathKey}.${opKey}.parameters[${indx}]`,
                  message:
                    'Required parameters should appear before optional parameters.'
                });
              }
            }
          }
        }
      }
    });
  });

  return { errors: result.error, warnings: result.warning };
};
