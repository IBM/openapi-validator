/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { preconditionHeader } from "../functions";

export const description =
  "Operations with `412` response must support at least one conditional header.";
export const message = "{{error}}";
export const formats = [oas3];
export const given = operations;
export const severity = "error";
export const resolved = true;
export const then = {
  function: preconditionHeader,
};
