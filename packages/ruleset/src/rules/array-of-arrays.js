/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { arrayOfArrays } from "../functions";

export const description =
  "Array schema with items of type array should be avoided";
export const message = "{{error}}";
export const given = schemas;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: arrayOfArrays,
};
