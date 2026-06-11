/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { validSchemaExample } from "../functions";

export const description =
  "Schema examples should validate against the schema they are defined for";
export const message = "{{error}}";
export const given = schemas;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: validSchemaExample,
};
