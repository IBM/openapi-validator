/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { patchOperations } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { patchRequestContentType } from "../functions";

export const description =
  "PATCH operations should support content types application/json-patch+json or application/merge-patch+json";
export const message = "{{description}}";
export const given = patchOperations;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: patchRequestContentType,
};
