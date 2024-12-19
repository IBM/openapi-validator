/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * This function takes a schema property name and uses a collection of regular
 * expressions to heuristically determine if the property is a date or a date
 * time property. It returns `true` if the name matches one of the expressions.
 *
 * @param {string} name the name of a schema property
 * @returns a boolean value indicating that the property seems to be date-based
 */
function isDateBasedName(name) {
  // Check for matching against certain patterns.
  const dateBasedNamePatterns = [
    // The name `created`.
    /^created$/,

    // The name `updated`.
    /^updated$/,

    // The name `modified`.
    /^modified$/,

    // The name `expired`.
    /^expired$/,

    // The name `expires`.
    /^expires$/,

    // Any name ending in `_at`.
    /.*_at$/,

    // Any name ending in `_on`.
    /.*_on$/,

    // Any name starting with `date_`.
    /^date_.*/,

    // Any name containing `_date_`.
    /.*_date_.*/,

    // Any name ending in `_date`.
    /.*_date$/,

    // Any name starting with `time_`.
    /^time_.*/,

    // Any name containing `_time_`.
    /.*_time_.*/,

    // Not including any name ending in `_time` because there are
    // counterexamples, but we still want to catch common date-based
    // names that end in `_time`.
    /^start_time$/,
    /^end_time$/,
    /^create_time$/,
    /^created_time$/,
    /^modify_time$/,
    /^modified_time$/,
    /^update_time$/,

    // Any name containing `timestamp`.
    /.*timestamp.*/,
  ];

  return dateBasedNamePatterns.some(regex => regex.test(name));
}

/**
 * This function takes an example string value and uses a collection of regular
 * expressions to heuristically determine if the value is a date or a date
 * time. It returns `true` if the value matches one of the expressions.
 *
 * @param {string} value an example value for a schema or schema property
 * @returns a boolean value indicating that the value seems to be date-based
 */
function isDateBasedValue(value) {
  const regularExpressions = [
    // Includes abbreviated month name.
    /^\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/,

    // Includes full month name.
    /^\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/,

    // Includes date in the format YYYY(./-)MM(./-)DD(T).
    /\b\d{4}[./-](0?[1-9]|1[012])[./-]([012]?[1-9]|3[01])(\b|T)/,

    // Includes date in the format DD(./-)MM(./-)YYYY.
    /\b([012]?[1-9]|3[01])[./-](0?[1-9]|1[012])[./-]\d{4}\b/,

    // Includes date in the format MM(./-)DD(./-)YYYY.
    /\b(0?[1-9]|1[012])[./-]([012]?[1-9]|3[01])[./-]\d{4}\b/,

    // Includes time in the format (T)tt:tt:tt (where t can be s/m/h/etc.)
    /(\b|T)\d\d:\d\d:\d\d\b/,
  ];

  return regularExpressions.some(r => r.test(value));
}

module.exports = {
  isDateBasedName,
  isDateBasedValue,
};
