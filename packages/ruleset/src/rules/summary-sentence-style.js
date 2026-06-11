/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { pattern } from "@stoplight/spectral-functions";

export const description =
  "Operation summaries should not have a trailing period";
export const severity = "warn";
export const formats = [oas3];
export const resolved = false;
export const given = "$.paths[*][*].summary";
export const then = {
  function: pattern,
  functionOptions: {
    notMatch: "\\.$",
  },
};
