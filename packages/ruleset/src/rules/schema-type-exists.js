/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { schemaTypeExists } from "../functions";

export const description =
  "Schemas and schema properties should have a non-empty `type` field. **This rule is disabled by default.**";
export const message = "{{error}}";
export const given = schemas;
export const severity = "off";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: schemaTypeExists,
};
