const JSONSchema = require('jsonschema');
const { transformPathToArray } = require('../../../../path-translator.js');

const jsonSchema = require('./jsonSchema');
const { getLineNumberForPath } = require('../../../ast/ast');

const validator = new JSONSchema.Validator();
validator.addSchema(jsonSchema);

module.exports.validate = function({ jsSpec, specStr, settings = {} }) {
  settings.schemas.forEach(schema => validator.addSchema(schema));
  return validator
    .validate(jsSpec, settings.testSchema || {})
    .errors.map(err => {
      return {
        level: 'error',
        line: getLineNumberForPath(
          specStr,
          transformPathToArray(err.property, jsSpec) || []
        ),
        path: err.property.replace('instance.', ''),
        message: err.message,
        source: 'schema',
        original: err // this won't make it into state, but is still helpful
      };
    });
};
