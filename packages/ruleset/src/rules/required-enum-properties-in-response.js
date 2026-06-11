/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { responseSchemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

import { requiredEnumPropertiesInResponse } from '../functions';

export const description =
  'Enumeration properties defined in a response must be required.';
export const message = '{{error}}';
export const given = responseSchemas;
export const severity = 'error';
export const resolved = true;
export const then = {
  function: requiredEnumPropertiesInResponse,
};
