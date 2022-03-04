const { isObject, mergeWith } = require('lodash');

// Takes a schema, and if an allOf field is provided,
// merges all allOf schema properties to create one schema
module.exports = function(schema) {
  const mergedSchema = Object.assign({}, schema);
  const allOfArr = mergedSchema['allOf'];
  // delete now, so it is not merged back into the final result
  delete mergedSchema['allOf'];
  if (allOfArr && Array.isArray(allOfArr)) {
    allOfArr.forEach(function(allOfSchema) {
      // deep merges the allOf schema into the aggregate schema
      // uses a function to concatenate arrays instead of overwriting
      mergeWith(mergedSchema, allOfSchema, customizer);
    });
  }
  return mergedSchema;
};

function customizer(objValue, srcValue) {
  // keep the original values for non-object fields instead of overwriting
  // will maintain the `type`, `description`, `summary`, etc. fields
  if (!isObject(objValue)) {
    return objValue;
  }
  // if the object is an array combine the arrays
  // otherwise, not an array, so return undefined and
  // mergeWith will do default object deep merging
  return Array.isArray(objValue) ? objValue.concat(srcValue) : undefined;
}
