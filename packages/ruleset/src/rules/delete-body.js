/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { deleteBody } from "../functions";

export const description =
  "Delete operations should not contain a requestBody.";
export const message = "{{error}}";
export const severity = "off";
export const formats = [oas3];
export const resolved = true;
export const given = operations;
export const then = {
  function: deleteBody,
};
