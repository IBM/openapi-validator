// Assertation 1:
// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array

// Assertation 2:
// The required properties for a Schema Object must be defined in the object or one of its ancestors.

// Assertation 3
// (For Swagger 2 specs. In the OAS 3 spec, headers do not have types. Their schemas will be checked by Assertation 1):
// Headers with 'array' type require an 'items' property

const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const at = require('lodash/at');

const reduceObj = function(jsSpec, obj) {
  if (obj['$ref']) {
    const objPath = obj['$ref'].split('/');
    objPath.shift();
    return reduceObj(jsSpec, at(jsSpec, [objPath])[0]);
  }
  return obj;
};

const checkReqProp = function(jsSpec, obj, requiredProp) {
  obj = reduceObj(jsSpec, obj);
  if (obj.properties && obj.properties[requiredProp]) {
    return true;
  } else if (Array.isArray(obj.anyOf) || Array.isArray(obj.oneOf)) {
    const childList = obj.anyOf || obj.oneOf;
    let reqPropDefined = true;
    childList.forEach(childObj => {
      if (!checkReqProp(jsSpec, childObj, requiredProp)) {
        reqPropDefined = false;
      }
    });
    return reqPropDefined;
  } else if (Array.isArray(obj.allOf)) {
    let reqPropDefined = false;
    obj.allOf.forEach(childObj => {
      if (checkReqProp(jsSpec, childObj, requiredProp)) {
        reqPropDefined = true;
      }
    });
    return reqPropDefined;
  }
  return false;
};

module.exports.validate = function({ jsSpec }, config) {
  const messages = new MessageCarrier();

  walk(jsSpec, [], function(obj, path) {
    // `definitions` for Swagger 2, `schemas` for OAS 3
    // `properties` applies to both
    const modelLocations = ['definitions', 'schemas', 'properties'];
    const current = path[path.length - 1];

    if (
      current === 'schema' ||
      modelLocations.indexOf(path[path.length - 2]) > -1
    ) {
      // if parent is 'schema', or we're in a model definition

      // Assertation 1
      if (obj.type === 'array' && typeof obj.items !== 'object') {
        messages.addMessage(
          path.join('.'),
          "Schema objects with 'array' type require an 'items' property",
          'error'
        );
      }

      // Assertation 2
      const undefinedRequiredProperties =
        config.schemas.undefined_required_properties;
      if (Array.isArray(obj.required)) {
        obj.required.forEach((requiredProp, i) => {
          if (!checkReqProp(jsSpec, obj, requiredProp)) {
            messages.addMessage(
              path.concat([`required[${i}]`]).join('.'),
              "Schema properties specified as 'required' should be defined",
              undefinedRequiredProperties,
              'schemas.undefined_required_properties'
            );
          }
        });
      }
    }

    // this only applies to Swagger 2
    if (path[path.length - 2] === 'headers') {
      if (obj.type === 'array' && typeof obj.items !== 'object') {
        messages.addMessage(
          path,
          "Headers with 'array' type require an 'items' property",
          'error'
        );
      }
    }
  });

  return messages;
};
