/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject, mergeWith } = require('lodash');

// Takes a schema, and if an allOf field is provided,
// merges all allOf schema properties to create one schema
function mergeAllOfSchemaProperties(schema) {
  // Bail out immediately if 'schema' has no "allOf" field.
  if (!('allOf' in schema)) {
    return schema;
  }

  // Our merge target is initially an empty object.
  let targetSchema = {};

  // Make a copy of the source schema so that we can delete
  // the allOf field later.
  const sourceSchema = JSON.parse(JSON.stringify(schema));

  // Grab the allOf list from the source schema (if present)
  // and then delete it from the source schema so that
  // only the other fields are left (we'll merge those last).
  const allOfArr = sourceSchema['allOf'];
  delete sourceSchema['allOf'];

  if (allOfArr && Array.isArray(allOfArr)) {
    // Merge each of the allOf list element schemas into the
    // target schema, one at a time.
    // The 'customizer' function will contatenate arrays
    // instead of overwriting.
    allOfArr.forEach(function (allOfSchema) {
      mergeWith(targetSchema, allOfSchema, customizer);
    });
  }

  // Finally, merge the remaining fields from our source schema into the target.
  mergeWith(targetSchema, sourceSchema, customizer);

  // If the result of the merge still has an allOf field (i.e. a nested allOf),
  // then do the merge recursively to handle it.
  if ('allOf' in targetSchema) {
    targetSchema = mergeAllOfSchemaProperties(targetSchema);
  }

  return targetSchema;
}

/**
 * This function is used as the customizer function passed to the mergeWith()
 * function to do a deep merge of a source schema into a target schema.
 * @param {*} targetValue a field from the merge target (might be undefined)
 * @param {*} sourceValue a field from the merge source
 * @returns the "merged" value
 */
function customizer(targetValue, sourceValue) {
  // Allow non-object fields from the merge source to be overwritten in the target.
  if (!isObject(sourceValue)) {
    return sourceValue;
  }

  // If the object is an array combine the arrays.
  // Otherwise, not an array, so return undefined and
  // mergeWith will do default object deep merging.
  return Array.isArray(targetValue)
    ? targetValue.concat(sourceValue)
    : undefined;
}

module.exports = mergeAllOfSchemaProperties;
