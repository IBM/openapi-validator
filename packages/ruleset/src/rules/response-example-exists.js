/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { responseExampleExists } = require('../functions');

module.exports = {
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
