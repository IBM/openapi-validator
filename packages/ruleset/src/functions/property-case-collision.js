const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, propertyCaseCollision);
};

const errorMsg = 'Property names should not be identical';

function propertyCaseCollision(schema, path) {
  // TODO: check `checkCaseStatus !== 'off'` ?
  const errors = [];

  if (schema.properties) {
    const prevProps = [];

    for (const [propName, prop] of schema.properties) {
      if (propName.slice(0, 2) === 'x-') continue;

      // Skip check for deprecated properties.
      if (prop.deprecated === true) continue;

      const caselessPropName = propName.replace(/[_-]/g, '').toLowerCase();
      if (prevProps.includes(caselessPropName)) {
        errors.push({
          message: errorMsg,
          path
        });
      } else {
        prevProps.push(caselessPropName);
      }
    }
  }

  return errors;
}
