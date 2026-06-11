/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas2, oas3 } from "@stoplight/spectral-formats";
import { parameterDefault } from "../functions";

export const description =
  "Required parameters should not define a default value";
export const message = "{{error}}";
export const given = parameters;
export const severity = "warn";
export const formats = [oas2, oas3];
export const resolved = true;
export const then = {
  function: parameterDefault,
};
