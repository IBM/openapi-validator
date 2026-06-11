/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { securitySchemes } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { securitySchemeAttributes } from '../functions';

export const description =
  'Validates the attributes of security schemes within an OpenAPI 3 document';
export const message = '{{error}}';
export const given = securitySchemes;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: securitySchemeAttributes,
};
