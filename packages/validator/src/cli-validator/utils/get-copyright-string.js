/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import getVersionString from './get-version-string.js';

export default function () {
  return `IBM OpenAPI Validator (${getVersionString()}), @Copyright IBM Corporation 2017, ${new Date().getFullYear()}.`;
}
