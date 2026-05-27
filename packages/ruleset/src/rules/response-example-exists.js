/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { responseExampleExists } from '../functions/index.js';

export default {
  description: 'Each response should include an example',
  message: '{{error}}',
  given:
    '$.paths[*][*].responses[?(@property >= 200 && @property < 300)].content.application/json',
  severity: 'warn',
  resolved: true,
  then: {
    function: responseExampleExists,
  },
};
