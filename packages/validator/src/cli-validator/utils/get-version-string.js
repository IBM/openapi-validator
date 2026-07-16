/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import packageJson from '../../../package.json' with { type: 'json' };

export default function () {
  return `validator: ${packageJson.version}`;
}
