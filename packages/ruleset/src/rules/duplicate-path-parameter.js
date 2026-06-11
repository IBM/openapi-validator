/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { duplicatePathParameter } from "../functions";

export const description =
  "Common path parameters should be defined on the path object.";
export const given = paths;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: duplicatePathParameter,
};
