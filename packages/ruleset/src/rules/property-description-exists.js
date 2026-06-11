/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { propertyDescriptionExists } from "../functions";

export const description =
  "Schema properties should have a non-empty description";
export const message = "{{error}}";
export const given = schemas;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: propertyDescriptionExists,
};
