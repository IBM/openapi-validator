/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Returns `true` if the input is a non-`null` object and not an array.
 */
const isObject = thing => {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
};

module.exports = isObject;
