// Assertation 1:
// The items property for a parameter is required when its type is set to array

const { isParameterObject, walk } = require('../../../utils');

module.exports.validate = function({ resolvedSpec }) {
  const errors = [];
  const warnings = [];

  walk(resolvedSpec, [], (obj, path) => {
    const isContentsOfParameterObject = isParameterObject(path, false); // 2nd arg is isOAS3

    // 1
    if (isContentsOfParameterObject) {
      if (obj.type === 'array' && typeof obj.items !== 'object') {
        errors.push({
          path,
          message: "Parameters with 'array' type require an 'items' property."
        });
      }
    }
  });

  return { errors, warnings };
};
