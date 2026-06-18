/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { schemaOrContentProvided } from '../functions';

export const description = 'Parameter must provide either a schema or content';
export const message = '{{error}}';
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const given = '$.paths[*][*].parameters[*]';
export const then = {
  function: schemaOrContentProvided,
};
