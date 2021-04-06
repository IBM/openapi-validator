const AJV = require('ajv');
const ajv = new AJV({ allErrors: true, jsonPointers: true });
const { STATIC_ASSETS } = require('@stoplight/spectral/dist/assets');

// performs JSON Schema validation on the given object
// expects `schemaKey` options with the key to retrieve the schema
module.exports = function(obj, opts, paths) {
  const errors = [];
  const rootPath = paths.target !== void 0 ? paths.target : paths.given;
  const jsonSchema = JSON.parse(STATIC_ASSETS[opts.schemaKey]);
  const validate = ajv.compile(jsonSchema);
  if (!ajv.validate(jsonSchema, obj)) {
    return formatAJVErrors(validate.errors, rootPath);
  }
  return errors;
};

function formatAJVErrors(errors, rootPath) {
  const errorList = [];
  errors.forEach(function(err) {
    errorList.push({
      message: err.message,
      path: getErrPath(err, rootPath)
    });
  });
  return errorList;
}

function getErrPath(err, rootPath) {
  const relativePath = err.dataPath.split('/');
  if (relativePath.length > 1) {
    const strippedPath = relativePath.splice(
      relativePath.indexOf('') + 1,
      relativePath.length
    );
    return [...rootPath, ...strippedPath];
  }
  return rootPath;
}
