/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { integerAttributes } from "../functions";

export const description =
  "Integer schemas should have certain attributes defined";
export const message = "{{error}}";
export const severity = "error";
export const formats = [oas3];
export const resolved = true;
export const given = schemas;
export const then = {
  function: integerAttributes,
};
