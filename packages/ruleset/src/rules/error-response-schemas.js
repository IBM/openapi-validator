/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { errorResponseSchemas } from "../functions";

export const description =
  "Error response schemas should comply with API Handbook guidance";
export const message = "{{error}}";
export const given =
  "$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content[*].schema";
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: errorResponseSchemas,
};
