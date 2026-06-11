/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import {
  responseSchemas,
  requestBodySchemas,
} from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { acceptAndReturnModels } from '../functions';

export const description =
  'Request and response bodies must be defined as model instances';
export const given = [...responseSchemas, ...requestBodySchemas];
export const message = '{{error}}';
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: acceptAndReturnModels,
};
