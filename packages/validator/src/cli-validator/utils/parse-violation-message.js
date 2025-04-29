/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Rule violations messages, use a standard format of
// "<general message>: <any specific details>". This function
// provides a quick utility to extract the generalized and
// detail sections from the message.
function parseViolationMessage(message) {
  const [general, detail] = message.split(':');
  return [general.trim(), detail?.trim()];
}

module.exports = parseViolationMessage;
