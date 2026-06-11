/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { noAmbiguousPaths } from "../functions";

export const description =
  "Avoid ambiguous path strings within an OpenAPI document";
export const message = "{{error}}";
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const given = ["$.paths"];
export const then = {
  function: noAmbiguousPaths,
};
