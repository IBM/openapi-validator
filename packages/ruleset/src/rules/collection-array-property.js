/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { collectionArrayProperty } from "../functions";

export const description =
  "Collection list operation response schema should define array property whose name matches the final path segment of the operation path";
export const message = "{{error}}";
export const given =
  "$.paths[*].get.responses[?(@property.match(/2\\d\\d/))].content[*].schema";
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: collectionArrayProperty,
};
