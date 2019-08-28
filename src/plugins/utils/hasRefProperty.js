const at = require('lodash/at');

/*
  Checks the unresolved spec to see if the object at path `path`
  has a `$ref` property. Useful when validating a resolved spec
  and want to know if a certain object was referenced or defined
  inline.
*/

module.exports = (jsSpec, path) => {
  if (Array.isArray(path)) {
    path = convertArrayToBracketNotation(path);
  } else {
    // if not array, assuming it is a dot separated string
    //
    // note: it is not a good idea to use this pattern,
    // as parameter names sometimes have periods in them.
    // only arrays should be passed in
    path = convertArrayToBracketNotation(path.split('.'));
  }

  const objectAtGivenPath = at(jsSpec, path)[0];
  return Boolean(objectAtGivenPath && objectAtGivenPath.$ref);
};

// returns a string with format parentKey['nextKey']['nextKey']['etc']
function convertArrayToBracketNotation(path) {
  return path.reduce((result, element) => result + `['${element}']`);
}
