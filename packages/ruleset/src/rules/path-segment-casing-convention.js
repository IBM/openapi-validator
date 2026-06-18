/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { pathSegmentCasingConvention } from '../functions';

export const description =
  'Path segments must follow a specified case convention';
export const message = '{{error}}';
export const formats = [oas3];
export const given = paths;
export const severity = 'error';
export const then = {
  function: pathSegmentCasingConvention,
  functionOptions: {
    type: 'snake',
  },
};
