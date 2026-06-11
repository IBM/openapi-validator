/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { securitySchemes } from "../functions";

export const description =
  "Validates the security schemes within an OpenAPI 3 document";
export const message = "{{error}}";
export const given = ["$"];
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: securitySchemes,
};
