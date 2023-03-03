/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * This function will return true if the specified path successfully matches the specified regex.
 * The elements of "path" are joined using "," as the delimiter, and the resulting
 * string is matched against the regex.
 * Example:
 *   path:  [ "paths", "/v1/drinks", "post", "parameters", "0", "schema"]
 *   regex: /^.*parameters,\d+,schema$/
 *   result: true
 * @param {string[]} path an array of strings, where each string represents an element in the json path
 * @param {string|Regexp} regexp a string or RegExp to be matched against the path
 * @returns boolean
 */
const pathMatchesRegexp = (path, regexp) => {
  if (!Array.isArray(path)) {
    throw 'argument "path" must be an array!';
  }

  if (!(regexp instanceof RegExp) && typeof regexp !== 'string') {
    throw 'argument "regexp" must be a string or RegExp instance!';
  }

  const pathString = path.join(',');
  return pathString.match(regexp) ? true : false;
};

module.exports = pathMatchesRegexp;
