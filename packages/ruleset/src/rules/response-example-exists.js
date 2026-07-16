/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { responseExampleExists } from '../functions/index.js';

export const description = 'Each response should include an example';
export const message = '{{error}}';
export const given =
  '$.paths[*][*].responses[?(@property >= 200 && @property < 300)].content.application/json';
export const severity = 'warn';
export const resolved = true;
export const then = {
  function: responseExampleExists,
};
