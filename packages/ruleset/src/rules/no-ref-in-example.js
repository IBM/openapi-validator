/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { noRefInExample } from "../functions";
export const description =
  "The use of $ref is not valid within an example field";
export const message = "{{description}}";
export const given = ["$..example"];
export const severity = "error";
export const formats = [oas3];
export const resolved = false;
export const then = {
  function: noRefInExample,
};
