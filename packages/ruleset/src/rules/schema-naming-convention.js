/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { schemaNamingConvention } from "../functions";

export const description =
  "Schemas should follow naming conventions in the API Handbook";
export const message = "{{error}}";
export const given = ["$"];
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: schemaNamingConvention,
};
