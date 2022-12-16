/**
 * Returns `true` if the input is a non-`null` object and not an array.
 */
const isObject = thing => {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
};

module.exports = isObject;
