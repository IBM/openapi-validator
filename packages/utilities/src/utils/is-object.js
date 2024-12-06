/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Returns `true` if `thing` is a non-`null` object and not an array.
 * @param {any} thing input to check
 * @returns {boolean}
 */
function isObject(thing) {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
}

module.exports = isObject;
