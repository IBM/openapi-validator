// Assertation 1:
// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array

// Assertation 2:
// The required properties for a Schema Object must be defined in the object or one of its ancestors.

// Assertation 3
// (For Swagger 2 specs. In the OAS 3 spec, headers do not have types. Their schemas will be checked by Assertation 1):
// Headers with 'array' type require an 'items' property

const { walk } = require('../../../utils');

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

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
        errors.push({
          path: path.join('.'),
          message:
            "Schema objects with 'array' type require an 'items' property"
        });
      }

      // Assertation 2
      if (Array.isArray(obj.required)) {
        obj.required.forEach((requiredProp, i) => {
          if (!obj.properties || !obj.properties[requiredProp]) {
            const pathStr = path.concat([`required[${i}]`]).join('.');
            errors.push({
              path: pathStr,
              message:
                "Schema properties specified as 'required' must be defined"
            });
          }
        });
      }
    }

    // this only applies to Swagger 2
    if (path[path.length - 2] === 'headers') {
      if (obj.type === 'array' && typeof obj.items !== 'object') {
        errors.push({
          path,
          message: "Headers with 'array' type require an 'items' property"
        });
      }
    }
  });

  return { errors, warnings };
};
