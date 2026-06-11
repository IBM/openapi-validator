/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { propertyAttributes } from '../functions';

export const description =
  'Performs checks on specific attributes of a schema or schema property';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: propertyAttributes,
};
