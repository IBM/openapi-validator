/**
 * Copyright 2024-2025 IBM Corporation.
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
  // The full and abbreviated values for months will be used in the generic
  // string check below, as well as in the group of date-based expressions in
  // the primary check below that.
  const months =
    /\b(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\b/g;

  // In an effort to avoid false positives with strings that may contain
  // date-time values, but are not themselves date-time values, check for
  // the presence of any lowercase letters that are not included in the
  // names of months or days.
  if (typeof value === 'string') {
    // "Day" strings are not enough on their own to determine date-time values,
    // but we need to remove them from any values before we check for any
    // letters that are not relevant to a date-time value.
    const days =
      /\b(Mon(day)?|Tue(sday)?|Wed(nesday)?|Thu(rsday)?|Fri(day)?|Sat(urday)?|Sun(day)?)\b/g;

    // Only lowercase letters are checked for because 1) there are a number of
    // valid date-time uses of uppercase letters like T, Z, GMT, UTC, etc. but
    // not lowercase letters and 2) lowercase letters are more likely to
    // indicate a general string over a formatted value.
    const hasNonDateLetters = !!value
      .replaceAll(months, '')
      .replaceAll(days, '')
      .match(/[a-z]/);

    if (hasNonDateLetters) {
      return false;
    }
  }

  const regularExpressions = [
    // Includes full or abbreviated month name.
    months,

    // Includes date in the format YYYY(./-)MM(./-)DD(T).
    /\b\d{4}[./-](0?[1-9]|1[012])[./-]([012]?[1-9]|3[01])(\b|T)/,

    // Includes date in the format DD(./-)MM(./-)YYYY.
    /\b([012]?[1-9]|3[01])[./-](0?[1-9]|1[012])[./-]\d{4}\b/,

    // Includes date in the format MM(./-)DD(./-)YYYY.
    /\b(0?[1-9]|1[012])[./-]([012]?[1-9]|3[01])[./-]\d{4}\b/,

    // Includes time in the format (T)tt:tt:tt (where t can be s/m/h/etc.)
    // In this case, don't consider a colon character a word break, to avoid
    // matching non-time, colon-separated values like MAC addresses.
    /(\b|T)\d\d:\d\d:\d\d(\b[^:])/,
  ];

  return regularExpressions.some(r => r.test(value));
}

module.exports = {
  isDateBasedName,
  isDateBasedValue,
};
