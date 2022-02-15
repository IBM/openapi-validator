const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, propertyCaseCollision);
};

const errorMsg = 'Property names should not be identical';

function propertyCaseCollision(schema, path) {
  const errors = [];

  if (schema.properties) {
    const prevProps = [];

    for (const [propName, prop] of Object.entries(schema.properties)) {
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
