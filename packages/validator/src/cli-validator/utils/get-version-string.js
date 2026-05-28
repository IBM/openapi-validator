/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import packageConfig from '../../../package.json' assert { type: 'json' };

export default function () {
  return `validator: ${packageConfig.version}`;
}
