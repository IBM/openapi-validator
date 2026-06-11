/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { requestAndResponseContent } from "../functions";

export const description =
  "Request bodies and non-204 responses should define a content object";
export const given = operations;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: requestAndResponseContent,
};
